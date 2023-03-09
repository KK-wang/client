import * as Koa from "koa";
import * as errorTypes from "../definition/constants";
import jwt from "jsonwebtoken";
import config from "../definition/vars";

async function verifyAuth(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  // 函数的参数类型如果含有泛型，那么在定义函数时就可以直接指定参数的泛型。
  // 如果函数本身含有泛型，那么这个泛型所对应的类型参数在定义函数时是不能被确定的。
  /* 总之定义泛型时不能指定其类型参数，应用泛型时就可以指定类型参数了。*/
  const authorization = ctx.headers.authorization;
  if (!authorization) {
    const error = new Error(errorTypes.UNAUTHORIZATION);
    return ctx.app.emit('error', error, ctx);
  }
  const token = authorization.replace("Bearer ", "");
  try {
    jwt.verify(token, config.PUBLIC_KEY, {
      algorithms: ["RS256"]
    });
    await next();
  } catch (err) {
    // 除了 login 接口以外，所有接口的错误信息均从这里返回。
    ctx.body = {
      status: 509,
      message: "error message from verifyAuth middleware.",
      err,
    };
  }
}

export default verifyAuth;




