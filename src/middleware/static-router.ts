import * as Koa from "koa";
import fs from "fs";
import path from "path";

async function staticRouter(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const staticPath = ["/", "/token", "/node", "/pod", "/algorithm"];
  if (staticPath.includes(ctx.path)) {
    ctx.type = 'html';
    ctx.body = fs.readFileSync(path.resolve(__dirname + "../../../static/index.html"), "utf-8");
  }
  await next();
}

export default staticRouter;




