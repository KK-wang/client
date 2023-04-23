import * as Koa from "koa";
import k8sAPI from "../utils/k8s-client";
import { NodeSSH } from "node-ssh";
import config from "../definition/vars";
import nodeInfoPlus from "../definition/node-info";
import { V1Pod } from "@kubernetes/client-node";
import sshUtils from "../utils/ssh";
import imageCalcMap from "../definition/image-calc-map";

interface INodeListMetrics {
  [key: string]: {
    numsCPU: number
    idleCPU: { [key: number]: number, average: number },
    // 空闲的 CPU。
    availableMem: { [key: number]: number, average: number },
    // 空闲的内存。
  }
}


// 由于集群的异构性，只能通过 ssh 获取资源的使用信息。
async function getAllNodesMetrics(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const entries = Object.entries(sshUtils);
  const nodeListMetrics: INodeListMetrics = {};
  const promiseArr: Promise<number>[] = [];

  for (const [key, value] of entries) {
    if (value.ssh.connection === null){ 
      try {
        await value.link();
      } catch {
        continue;
      }
    }
    promiseArr.push(helper(key, value));
  }
  await Promise.all(promiseArr);
  ctx.body = nodeListMetrics;

  async function helper (key: string, value: {
    ssh: NodeSSH;
    link: () => void;
  }) {
    const res = await value.ssh.execCommand("lscpu | grep CPU | head -n 2 && vmstat 2 6");
    // vmstat 2 5 命令表示每隔两秒输出一次资源使用情况，一共输出五次。
    let arr = res.stdout.split("\n");
    arr = [arr[1], ...arr.slice(4)];
    const newArr = arr.map(item => item.trim().split(/\s+/));
    const numsCPU = parseInt(newArr[0][1]);
    const idleCPU: { [key: number]: number, average: number } = { average: -1 };
    const availableMem: { [key: number]: number, average: number } = { average: -1 };
    let idleCPUSum = 0, availableMemSum = 0;
    for (let i = 2; i < newArr.length; i++) {
      idleCPU[i - 1] = parseInt(newArr[i][14]);
      availableMem[i - 1] = parseInt(newArr[i][3]) + parseInt(newArr[i][4]) + parseInt(newArr[i][5]);
      idleCPUSum += idleCPU[i - 1];
      availableMemSum += availableMem[i - 1];
    }
    idleCPU.average = idleCPUSum / 5;
    availableMem.average = availableMemSum / 5;
    nodeListMetrics[key] = {
      numsCPU,
      idleCPU,
      availableMem,
    };
    return 0;
  };
}

interface INodesInfo {
  [nodeName: string]: {
    status: boolean,
    ip: string,
    cpu: string,
    mem: string,
    os: string,
    role: string,
    k8sVersion: string,
    dockerVersion: string,
    business: string,
    pods: {
      [podName: string]: {
        image: string,
        status: number,
        githubUrl: string,
        calcMetrics: string,
      },
    }
  }
}

function getMasterSSH() {
  const ssh = new NodeSSH();
  ssh.connect({
    host: config.MASTER_HOST,
    username: config.MASTER_USERNAME,
    port: config.SSH_PORT,
    password: config.MASTER_PASSWORD,
  }).catch(() => {});
  return ssh;
}

function getPodStatus(pod: V1Pod) {
  if (pod.status?.containerStatuses === undefined) {
    // 一般情况下，Pod 不会创建失败，出现 undefined 的原因可能是由于只是下达了创建指令，kubelet 还没有启动 Pod 或者 Pod 正在启动过程中，从而导致 kubelet 尚未能够获取其状态信息。
    return 0; // 直接返回创建中的信息。
  }
  if (pod.status?.containerStatuses![0]?.state?.waiting !== undefined) {
    if (pod.status?.containerStatuses![0]?.state?.waiting?.reason === "ContainerCreating")  return 0; // 创建中。
    if (pod.status?.containerStatuses![0]?.state?.waiting?.reason === "CrashLoopBackOff")  return 1; // 运行中。
  }
  if (pod.status?.containerStatuses![0]?.state?.running !== undefined) return 1; // 运行中。
  if (pod.status?.containerStatuses![0]?.state?.terminated !== undefined) return 2; // 已完成。
}

async function getNodes(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const nodes: INodesInfo = { };
  const masterSSH = getMasterSSH();
  const sshesWithMaster: { [node: string]: NodeSSH } = {
    master: masterSSH,
  }
  const sshUtilKeys = Object.keys(sshUtils);
  sshUtilKeys.forEach(key => sshesWithMaster[key] = sshUtils[key].ssh);
  for (const [key, value] of Object.entries(sshesWithMaster)) {
    // Error: read ECONNRESET 错误可能会引起 ssh connection 中断。
    if (value.connection === null) {
      if (key === "master") nodes[key] = { status: false, pods: {}, ...(nodeInfoPlus[key])};
      else {
        try {
          await sshUtils[key].link();
          nodes[key] = { status: true, pods: {}, ...(nodeInfoPlus[key])};
        } catch {
          nodes[key] = { status: false, pods: {}, ...(nodeInfoPlus[key])};
        }
      }
    }
    else nodes[key] = { status: true, pods: {}, ...(nodeInfoPlus[key])};
  }
  const podInfo = await k8sAPI.listNamespacedPod("default", "true");
  const pods = podInfo.body.items;
  for (const pod of pods) {
    const nodeName = pod.spec?.nodeName!;
    const podName = pod.metadata?.name!;
    const calc = imageCalcMap[pod.spec?.containers[0].image!];
    nodes[nodeName].pods[podName] = {
      image: pod.spec?.containers[0].image!,
      status: getPodStatus(pod)!,
      githubUrl: `https://github.com/KK-wang/ai-task/blob/master/various-task/Dockerfile.${calc.slice(0, -3)}s`,
      calcMetrics: calc,
    };
  };
  masterSSH.dispose();
  ctx.body = nodes;
}
 
export {
  getAllNodesMetrics,
  getNodes,
}