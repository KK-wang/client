import * as Koa from "koa";
import * as errorTypes from "../definition/constants"

function errorHandler(error: Error, ctx: Koa.ParameterizedContext) {
  let status: number, message: string;
  switch (error.message) {
    case errorTypes.PASSWORD_IS_INCORRENT:
      status = 400;
      message = "密码错误";
      break;
    case errorTypes.USERNAME_DOES_NOT_EXIST:
      status = 401;
      message = "用户名不存在";
      break;
    case errorTypes.UNAUTHORIZATION:
      status = 403;
      message = "无访问权限";
      break;
    default:
      status = 404;
      message = "资源不存在";
  }
  ctx.status = status;
  ctx.body = message;
}

export default errorHandler;