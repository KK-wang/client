import * as jwt from "jsonwebtoken";
import config from "../definition/vars";
import * as Koa from "koa";
import { getUserByUsername } from "../service/user.service";
import * as errorTypes from "../definition/constants";
import crypto from "crypto";
import {DBType} from "../definition/types";

interface IRequestBody {
  username: string,
  password: string,
}

// 如何确定 middleware 中的参数究竟是什么类型，这就需要自底向上地一层层盘剥源码了。
// 总之一句话查看泛型和参数类型看底层。
/* type 这样的重定义语句除了抽离泛型和给泛型参数一个默认值以外，没啥其它作用，想看本质的定义需要直接看最底层。*/
async function login(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  // 如何理解带有泛型的 type 定义式？
  // 即重新命名类型，同时更好地抽离出泛型的参数位置。 

  // 1.获取用户名和密码。
  const { username, password } = ctx.request.body as IRequestBody; // 使用类型断言处理 unknown。

  // 2.判断用户是否存在。
  const user: DBType.IUser = await getUserByUsername(username);
  if (!user) {
    const error = new Error(errorTypes.USERNAME_OR_PASSWORD_IS_REQUIRED);
    return ctx.app.emit("error", error, ctx);
  }

  // 3.判断密码是否和数据库中的密码一致。
  if (crypto.createHash("md5").update(password).digest("hex") !== user.password) {
    const error = new Error(errorTypes.PASSWORD_IS_INCORRENT);
    return ctx.app.emit('error', error, ctx);
  }
  
  const token = jwt.sign({
    id: user.id,
    username: user.username,
  }, config.PRIVATE_KEY, {
    expiresIn: "100y", 
    // 延长 token 的过期时间。
    algorithm: "RS256",
  });

  ctx.body = {
    id: user.id,
    name: user.username,
    token,
  }
}

/**
 * Koa 中有两个重要的概念，state 和 context：
 * 源码中的 StateT 用来扩展 ctx.state 中的属性，
 * CustomT 用来扩展 ctx 中的属性。
 */

// 泛型的约束应该由声明处进行。
// 例如，默认情况下，state 的类型是 any，如果我们想要约束 state，可以通过 extends。
// 不过此处，我们可以直接使用联合类型 & 来约束赋予 state 更多意义，或者直接给 state 一个定义。

export {
  login,
}


