import * as Koa from "koa";
import * as errorTypes from "../definition/constants"

function errorHandler(error: Error, ctx: Koa.ParameterizedContext) {
  let status: number, message: string;
  switch (error.message) {
    case errorTypes.PASSWORD_IS_INCORRENT:
      status = 400;
      message = "Password is incorrent.";
      break;
    case errorTypes.USERNAME_DOES_NOT_EXIST:
      status = 401;
      message = "Username does not exist.";
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