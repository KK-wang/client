import Application = require("koa");
/* 
  这里的 Koa 就是 Application。
  export = 语法定义一个模块的导出对象。这里的对象一词指的是类、接口、命名空间、函数或枚举。若使用 export = 导出一个模块，则必须使用 TypeScript 的特定语法 import module = require("module") 来导入此模块。
  export = 语法是为了兼容 CommonJS 的。
*/
import bodyParser = require("koa-bodyparser");
import "./config/database"; // 初始化数据库。
import config from "./config/env-parser";

type Koa = Application;

const app: Koa = new Application();
app.use(bodyParser());

app.listen(config.APP_PORT, () => {
  console.log(`Node server starts on port ${config.APP_PORT}.`);
});