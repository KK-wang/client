import * as Koa from "koa";
import path from "path";
import sshUtils from "../utils/ssh";

async function checkUtil(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  for (const value of Object.values(sshUtils)) {
    if (value.ssh.connection === null) {
      try {
        await value.link();
      } catch {
        continue;
      }
    }
    const isExist = await value.ssh.execCommand("find util.sh");
    if (isExist.stderr === "") continue;
    await value.ssh.putFile(path.resolve(__dirname, "../config/shell/util.sh"), "/root/util.sh");       
  }
  await next();
}

export default checkUtil;