import * as Koa from "koa";
import path from "path";
import { PythonShell as py } from "python-shell";

interface IRequestBody {
  algorithm: string,
  nodes: {
    nodeName: string,
    cpu: number,
    mem: number,
  }[],
  tasks: {
    podName: string,
    image: string,
    nums: number,
    calcMetrics: string,
  }[]
}

interface ISolution {
  podName: string,
  image: string,
  nodeName: string,
}

type Solution = ISolution[]

async function createAlgorithmTask(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const { algorithm, nodes, tasks } = ctx.request.body as IRequestBody;
  const res = await py.run(path.resolve(__dirname, `../config/algorithm/${algorithm}alg.py`), {
    mode: "json",
    args: [JSON.stringify({ nodes, tasks })], // 传递 JSON 参数。
  });
  ctx.body = res[0] as Solution;
}

export {
  createAlgorithmTask,
}

