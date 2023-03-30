import k8sAPI from "../utils/k8s-client";
import * as Koa from "koa";
import moment from "moment";
import { V1Pod } from "@kubernetes/client-node";
import sshUtils from "../utils/ssh";

interface IRequestBody {
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
      restartPolicy: "Never",
      containers: [
        {
          name: image,
          image: image,
          imagePullPolicy: "IfNotPresent",
        }
      ],
      nodeName: nodeName,
    }
  }
}


async function createPods(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  // 默认情况下，k8s 使用 Docker Hub。
  // 当一个 pod 执行完毕之后，它的状态就会变为 CrashLoopBackOff，此时可以使用 kubectl describe pod <pod-name> 来查看一下 Exit Code，如果其为 0，那么表示正常退出。
  const { podsBody } = ctx.request.body as IRequestBody;
  const res: { [podName: string]: number | undefined } = {};
  const promiseArr: Promise<number>[] = [];
  for (const info of podsBody) {
    promiseArr.push(helper(info));
  }
  await Promise.all(promiseArr);
  ctx.body = res;

  async function helper(info: {
      podName: string,
      image: string,
      nodeName: string,
    }) {
      const body = podBodyFactory(info.podName, info.image, info.nodeName);
      const tmpRes = await k8sAPI.createNamespacedPod("default", body, "true");
      // 这里需要保证 sshes 可用。
      if (sshUtils[info.nodeName].ssh.connection === null) 
        await sshUtils[info.nodeName].link();
      sshUtils[info.nodeName].ssh.execCommand(`bash util.sh ${info.podName}`);
      res[info.podName] = tmpRes.response.statusCode;
      return 0;
  }
}

// 删除所有的 Pod。
async function clearPods(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const clearRes = await k8sAPI.deleteCollectionNamespacedPod("default", "true");
  const sshArr = Object.values(sshUtils);
  let rmCount = 0;
  for (const value of sshArr) {
    if (value.ssh.connection === null) {
      try {
        await value.link();
      } catch {
        continue;
      }
    }
    const rmRes = await value.ssh.execCommand("rm -rf pod_running_logs");
    if (rmRes.stderr === "") rmCount++;
  }
  ctx.body = {
    clearPodsCode: clearRes.response.statusCode,
    shouldRmCount: sshArr.length,
    rmCount,
  };
}


interface IPodList {
  [key: string]: { runningTime: number }
}

function getPodStatus(pod: V1Pod) {
  if (pod.status?.containerStatuses === undefined) throw new Error(); // 有 Pod 处于创建失败的状态。
  if (pod.status?.containerStatuses![0]?.state?.waiting !== undefined) {
    if (pod.status?.containerStatuses![0]?.state?.waiting?.reason === "ContainerCreating")  return 0; // 创建中。
    if (pod.status?.containerStatuses![0]?.state?.waiting?.reason === "CrashLoopBackOff")  return 1; // 运行中。
  }
  if (pod.status?.containerStatuses![0]?.state?.running !== undefined) return 1; // 运行中。
  if (pod.status?.containerStatuses![0]?.state?.terminated !== undefined) return 2; // 已完成。
}

async function getAllPodsRunningInfo(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  // 泛型作为函数参数、变量、类或者接口的类型时，其内容由定义者来指定，而不是由调用者来指定，
  // 在指定泛型之后，参数是不需要带有泛型的，因为参数类型已经确定了。

  // 泛型作为函数本身的类型时，则需要调用者来指定，而不是定义者。
  const pods = await k8sAPI.listNamespacedPod("default", "true");

  const items = pods.body.items;
  const list: IPodList = {};
  
  for (const item of items) {
    const isFinish = getPodStatus(item) === 2;
    // 检测当前 pod 是否完成。
    if (!isFinish) {
      ctx.body = {
        status: 299,
        message: "unfinished",
      };
      return;
    }
    const podName = item.metadata?.name!;
    const startTime = item.status?.containerStatuses![0]?.state?.terminated?.startedAt,
      finishTime = item.status?.containerStatuses![0]?.state?.terminated?.finishedAt;
    const formatedStartTime = moment(startTime), formatedEndTime = moment(finishTime);
    list[podName] = {
      runningTime: formatedEndTime.diff(formatedStartTime, "second"), 
    };
  }
  ctx.state.runningTime = list; 
  // runningTime 描述了 pod 的任务执行时间。
  await next();
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