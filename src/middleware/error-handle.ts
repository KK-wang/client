import * as Koa from "koa";
import * as errorTypes from "../utils/constants"

function errorHandler(error: Error, ctx: Koa.ParameterizedContext) {
  let status: number, message: string;
  switch (error.message) {
    case errorTypes.USERNAME_OR_PASSWORD_IS_REQUIRED:
      status = 400;
      message = "Username or password is required.";
      break;
    case errorTypes.PASSWORD_IS_INCORRENT:
      status = 400;
      message = "Password is incorrent.";
      break;
    case errorTypes.UNAUTHORIZATION:
      status = 403;
      message = "Unauthorization.";
      break;
    default:
      status = 404;
      message = "Not found";
  }
  ctx.status = status;
  ctx.body = message;
}

export default errorHandler;