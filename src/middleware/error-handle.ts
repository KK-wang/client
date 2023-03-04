import * as Koa from "koa";
import * as errorTypes from "../config/constants"

function errorHandler(error: Error, ctx: Koa.ParameterizedContext) {
  let status: number, message: string;
  switch (error.message) {
    case errorTypes.USERNAME_OR_PASSWORD_IS_REQUIRED:
      status = 400; // Bad Request
      message = "Username or password is required.";
      break;
    case errorTypes.PASSWORD_IS_INCORRENT:
      status = 400; // Bad Request
      message = "Password is incorrent.";
      break;
    default:
      status = 404;
      message = "Not found";
  }
  ctx.status = status;
  ctx.body = message;
}

export default errorHandler;