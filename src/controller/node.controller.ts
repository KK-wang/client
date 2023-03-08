import * as Koa from "koa";
import Nodes from "../utils/ssh";

interface INodeListMetrics {
  [key: string]: {
    numsCPU: number
    idleCPU: { [key: number]: number, average: number },
    availableMem: { [key: number]: number, average: number },
  }
}


// 由于集群的异构性，只能通过 ssh 获取资源的使用信息。
async function getAllNodesMetrics(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const entries = Object.entries(Nodes);
  const nodeListMetrics: INodeListMetrics = {};
  for (const [key, value] of entries) {
    const res = await value.execCommand("lscpu | grep CPU | head -n 2 && vmstat 2 5");
    // vmstat 2 5 命令表示每隔两秒输出一次资源使用情况，一共输出五次。
    
    let arr = res.stdout.split("\n");
    arr = [arr[1], ...arr.slice(4)];
    const newArr = arr.map(item => item.trim().split(/\s+/));
    const numsCPU = parseInt(newArr[0][1]);
    const idleCPU: { [key: number]: number, average: number } = { average: -1 };
    const availableMem: { [key: number]: number, average: number } = { average: -1 };
    let idleCPUSum = 0, availableMemSum = 0;
    for (let i = 1; i < newArr.length; i++) {
      idleCPU[i] = parseInt(newArr[i][14]);
      availableMem[i] = parseInt(newArr[i][3]) + parseInt(newArr[i][4]) + parseInt(newArr[i][5]);
      idleCPUSum += idleCPU[i];
      availableMemSum += availableMem[i];
    }
    idleCPU.average = idleCPUSum / 5;
    availableMem.average = availableMemSum / 5;
    nodeListMetrics[key] = {
      numsCPU,
      idleCPU,
      availableMem,
    }
  }
  ctx.body = nodeListMetrics;
}
 
export {
  getAllNodesMetrics,
}