import * as Koa from "koa";
import sshes from "../utils/ssh";
import path from "path";

async function checkUtil(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  for (const ssh of Object.values(sshes)) {
    if (ssh.connection === null) continue;
    const isExist = await ssh.execCommand("find util.sh");
    if (isExist.stderr === "") continue;
    await ssh.putFile(path.resolve(__dirname, "../config/shell/util.sh"), "/root/util.sh");       
  }
  await next();
}

export default checkUtil;