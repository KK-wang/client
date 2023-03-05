import Application from "koa";
/* 
  这里的 Koa 就是 Application。
  export = 语法定义一个模块的导出对象。这里的对象一词指的是类、接口、命名空间、函数或枚举。若使用 export = 导出一个模块，则必须使用 TypeScript 的特定语法 import module = require("module") 来导入此模块。
  export = 语法是为了兼容 CommonJS 的。
*/
import bodyParser from "koa-bodyparser";
import "./utils/database"; // 初始化数据库。
import config from "./utils/parser";
import errorHandler from "./middleware/error-handle";
import { Koa } from "./utils/types";
import useRoutes from "./router";
import "./utils/k8s-client"; // 初始化 k8s 客户端。

const app: Koa = new Application();
app.use(bodyParser());
app.useRoutes = useRoutes;
app.useRoutes();
app.on("error", errorHandler);

app.listen(config.APP_PORT, () => {
  console.log(`Node server starts on port ${config.APP_PORT}.`);
});