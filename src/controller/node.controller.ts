import * as Koa from "koa";
import Nodes from "../utils/ssh";

interface INodeListMetrics {
  [key: string]: {
    numsCPU: number
    idleCPU: number,
    availableMem: number,
  }
}

async function getAllNodesMetrics(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  // TODO: 后续还是会将资源的使用信息更改为从 metrics server 中获取。
  const entries = Object.entries(Nodes);
  const nodeListMetrics: INodeListMetrics = {};
  for (const [key, value] of entries) {
    const res = await value.execCommand("lscpu | grep CPU | head -n 2 && top -bn 1 -i -c | grep Cpu && free -k | grep Mem");
    const [other, numsCPU, idleCPU, availableMem] = res.stdout.split("\n");
    const lastKeyNumsCPU = numsCPU.lastIndexOf(" ");
    const lastKeyAvailableMem = availableMem.lastIndexOf(" ");
    nodeListMetrics[key] = {
      numsCPU: parseInt(numsCPU.slice(lastKeyNumsCPU + 1)),
      idleCPU: parseFloat(idleCPU.split(",")[3].slice(0, -2)),
      availableMem: parseInt(availableMem.slice(lastKeyAvailableMem + 1)),
    };
  }
  ctx.body = nodeListMetrics;
}
 
export {
  getAllNodesMetrics,
}