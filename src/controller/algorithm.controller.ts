import * as Koa from "koa";
import path from "path";
import { PythonShell as py } from "python-shell";

interface IRequestBody {
  algorithm: string,
  data: {
    nodes: {
      nodeName: string,
      cpu: number,
      mem: number,
    }[],
    tasks: {
      podName: string,
      image: string,
    }[]
  }
}

async function createAlgorithmTask(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const { algorithm, data } = ctx.request.body as IRequestBody;
  const res = await py.run(path.resolve(__dirname, `../config/algorithm/${algorithm}alg.py`), {
    mode: "json",
    args: [JSON.stringify(data)], // 传递 JSON 参数。
  });
  ctx.body = {
    scheduling: res[0]
  };
}

export {
  createAlgorithmTask,
}

