import Router from "koa-router";

import { login } from "../controller/user.controller";

const tokenRouter = new Router();


tokenRouter.post("/login", login);
// 查看源码可知作为 middleware 的 login 接受两个泛型参数。
// 另外需要注意的是，当函数作为参数传递的时候，是不需要为该函数确定泛型的。

export default tokenRouter;

