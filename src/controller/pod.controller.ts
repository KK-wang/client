import k8sAPI, { metricsClient } from "../utils/k8s-client";
import * as Koa from "koa";
import moment from "moment";
import { topPods, V1Pod } from "@kubernetes/client-node";

interface IRequestBody {
  tag: string, // 用来标记某一批次的 Pod。
  podsBody: {
    podName: string,
    image: string,
    nodeName: string,
  }[],
}

function podBodyFactory(podName: string, image: string, nodeName: string): V1Pod {
  return {
    apiVersion: "v1",
    kind: "Pod",
    metadata: {
      name: podName,
    },
    spec: {
      containers: [
        {
          name: `${image}-container`,
          image: image
        }
      ],
      nodeName: nodeName,
    }
  }
}


async function createPods(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  // 默认情况下，k8s 使用 Docker Hub。
  // 当一个 pod 执行完毕之后，它的状态就会变为 CrashLoopBackOff，此时可以使用 kubectl describe pod <pod-name> 来查看一下 Exit Code，如果其为 0，那么表示正常退出。
  const { tag, podsBody } = ctx.request.body as IRequestBody;
  const res = [];
  for (const info of podsBody) {
    const body = podBodyFactory(info.podName, info.image, info.nodeName);
    const tmpRes = await k8sAPI.createNamespacedPod("default", body, "true");
    res.push(tmpRes.response.statusCode);
  }
  ctx.body = res;
  // TODO: 在创建完 pod 之后，应该使用日志工具不断的获取 pod 的 CPU 和 Mem 信息（可以通过 kubectl get pod 获取终止条件），
  // 并将这些信息存储到 sqlite 中。
}

// TODO: 后续还应添加 CPU 和 memory 的利用率信息，最后可以进行一下 average。
// 注意，这里需要使用到 ssh，最后所有的信息会存储到 sqlite 中。
function getAllPodsMetrics() {

}

// 删除所有的 Pod。
async function clearPods(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const res = await k8sAPI.deleteCollectionNamespacedPod("default", "true");
  ctx.body = res.response.statusCode;
}

interface IPodList {
  [key: string]: string | { runningTime: number }
}

async function getAllPodsRunningInfo(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  // 泛型作为函数参数、变量、类或者接口的类型时，其内容由定义者来指定，而不是由调用者来指定，
  // 在指定泛型之后，参数是不需要带有泛型的，因为参数类型已经确定了。

  // 泛型作为函数本身的类型时，则需要调用者来指定，而不是定义者。
  const pods = await k8sAPI.listNamespacedPod("default", "true");

  const items = pods.body.items;
  const list: IPodList = {};
  
  for (const item of items) {
    const isFinish = item.status?.containerStatuses?.at(0)?.state?.waiting;
    // 检测当前 pod 是否完成。
    if (!isFinish) {
      ctx.body = {
        status: 299,
        message: "unfinished",
      };
      return;
    }
    const podName = item.metadata?.name!;
    const startTime = item.status?.containerStatuses?.at(0)?.lastState?.terminated?.startedAt,
      finishTime = item.status?.containerStatuses?.at(0)?.lastState?.terminated?.finishedAt;
    const formatedStartTime = moment(startTime), formatedEndTime = moment(finishTime);
    list[podName] = {
      runningTime: formatedEndTime.diff(formatedStartTime, "second"), // running time 描述了 pod 的任务执行时间。
    };
    // TODO: 同时还应取出 CPU 和 Mem 信息。
  }
  ctx.body = list;
}

/**
 * 首先科普一下 Namespace 的概念：
 * 在 Kubernetes 中，Namespace 提供一种机制，将同一集群中的资源划分为相互隔离的组。
 * 同一名字空间内的资源名称要唯一，但跨名字空间时没有这个要求。
 * 需要注意的是，这种作用域对集群访问的对象不适用，例如 Node。
 * 
 * 那么什么时候使用多个 Namespace 呢？
 * 名字空间适用于存在很多跨多个团队或项目的用户的场景。
 * 对于只有几到几十个用户的集群，根本不需要创建或考虑名字空间。
 * 
 * Kubernates 启动时会创建四个初始命名空间，default、kube-node-lease、kube-public 和 kube-system。
 * 默认情况下，创建的 pod 都会被放置在 default namespace 下，注意对于生产环境，不要使用 default namespace。
 */ 

export {
  createPods,
  getAllPodsRunningInfo,
  clearPods
}