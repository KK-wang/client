import * as Koa from "koa";
import sshUtils from "../utils/ssh";

interface IResponseBody {
  [podName: string]: {
    nodeName: string,
    runningTime: number,
    cpuUsage: { // 占用的 CPU。
      [key: number]: number,
      average: number;
    },
    memUsage: { // 占用的内存。
      [key: number]: number,
      average: number;
    },
    message?: string,
  },
}

async function processMetrics(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const metrics: IResponseBody = {}
  const runningTime = ctx.state.runningTime;
  for (const [key, value] of Object.entries(sshUtils)) {
    if (value.ssh.connection === null) {
      try {
        await value.link();
      } catch {
        continue;
      }
    }
    const logList = await value.ssh.execCommand("ls pod_running_logs/");
    if (logList.stderr !== "") continue;
    const podNameArr = logList.stdout.trim().split(/\s+/).map(log => log.slice(0, -4));
    for (const podName of podNameArr) {
      const logContent = await value.ssh.execCommand(`cat pod_running_logs/${podName}.log`);
      let logMatrix = logContent.stdout.split("\n").map(line => line.trim().split(/\s+/));
      const memTotal = parseInt(logMatrix[0][1]), cpuNum = parseInt(logMatrix[1][1]);
      logMatrix = logMatrix.slice(2);
      metrics[podName] = {
        nodeName: key,
        runningTime: runningTime[podName].runningTime,
        cpuUsage: { average: -1 },
        memUsage: { average: -1 }
      };
      if (metrics[podName].runningTime <= 0.1) {
        metrics[podName].message = `The running time of pod named ${podName} is too short.`;
        continue;
      }
      metrics[podName].cpuUsage.average = 0;
      metrics[podName].memUsage.average = 0;
      for (let i = 0; i < logMatrix.length; i++) {
        metrics[podName].cpuUsage[i] = parseFloat(logMatrix[i][2]) * cpuNum;
        metrics[podName].cpuUsage.average += metrics[podName].cpuUsage[i];
        metrics[podName].memUsage[i] = parseFloat(logMatrix[i][3]) * memTotal;
        metrics[podName].memUsage.average += metrics[podName].memUsage[i];
      }
      metrics[podName].cpuUsage.average /= logMatrix.length;
      metrics[podName].memUsage.average /= logMatrix.length;  
    }
  }
  ctx.body = metrics;
}

export default processMetrics;