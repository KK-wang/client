import Application from "koa";
/* 
  这里的 Koa 就是 Application。
  export = 语法定义一个模块的导出对象。这里的对象一词指的是类、接口、命名空间、函数或枚举。若使用 export = 导出一个模块，则必须使用 TypeScript 的特定语法 import module = require("module") 来导入此模块。
  export = 语法是为了兼容 CommonJS 的。
*/
import bodyParser from "koa-bodyparser";
import "./utils/database"; // 初始化数据库。
import config from "./definition/vars";
import errorHandler from "./utils/error-handle";
import useRoutes from "./router";
import "./utils/k8s-client"; // 初始化 k8s 客户端。
import server from "koa-static";
import path from "path";
import fs from "fs";
import { Koa } from "./definition/types";
import staticRouter from "./middleware/static-router";

const app: Koa = new Application();
app.use(bodyParser());
app.use(server(path.resolve(__dirname, "../static"), {
  maxage: 60 * 60 * 1000, // 浏览器缓存时间为 1 小时。
}));
app.use(staticRouter);
app.useRoutes = useRoutes;
app.useRoutes();
app.on("error", errorHandler);
process.on("uncaughtException", err => {
  // 该回调函数会用来处理 Error: read ECONNRESET 错误。
  const errorLogPath = path.resolve(__dirname, "../error-log");
  if (!fs.existsSync(errorLogPath))
    fs.mkdirSync(errorLogPath);
  fs.writeFile(`${errorLogPath}/log.txt`, 
    `${new Date()}:\n${err.stack}\n-------------------------------------------------------\n----------------SSH 连接断开错误，已捕捉----------------\n`, 
    { flag: "a" }, () => {});  
});

app.listen(config.APP_PORT, () => {
  console.log(`Node server starts on port ${config.APP_PORT}.`);
});