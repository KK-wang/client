# 说明

本项目是边缘计算平台的管理后端，拥有创建 pod、获取 node 信息、获取 pod 信息和运行相应算法的功能。

项目使用 TypeScript 作为开发语言，Node 作为运行时，Koa 作为 Web 框架。

需要注意的是，SSH 连接如果长时间闲置会自动断开。鉴于这个特性，且项目在 SSH 连接上并没有采用“即用即连”的方式，所以该边缘计算管理平台只适合短时间内提供服务，长时间提供服务可能会报错，后续计划修改这个 BUG。

> *PS: node00 是施老师提供的 16 核云服务器，但是其不是很稳定，可能会出现服务不可用的情况。*

**2023.03.10 补充 :** 

上述 SSH 连接如果长时间闲置就会自动断开的 BUG 已经被修复了。查看 ssh2 的源码之后可知，添加 keepaliveInterval 及 keepaliveCountMax 属性即可解决。

**2023.03.21 补充 :**
应用有时会遇到 `Error: read ECONNRESET` 错误而出现程序崩溃的情况，之前为了解决这个错误，使用了进程级错误监听的方式:
```javascript
process.on("uncaughtException", err => {
  // 该回调函数会用来处理 Error: read ECONNRESET 错误。
  const errorLogPath = path.resolve(__dirname, "../error-log");
  if (!fs.existsSync(errorLogPath))
    fs.mkdirSync(errorLogPath);
  fs.writeFile(`${errorLogPath}/log.txt`, 
    `${new Date()}:\n${err.stack}\n----------------------------------------------------\n`, 
    { flag: "a" }, () => console.error("Record a uncaughtException in log..."));  
});
```
如此一来就能够 catch 错误，从而不让应用程序崩溃，后来发现 `Error: read ECONNRESET` 可能会影响到应用的 ssh 连接，因此决定放弃这种方法，转而使用 pm2 来保证应用能够长久存在，pm2 能够保证 node 应用在程序崩溃是自动重启: 

> When starting application with PM2, application are automatically restarted on auto exit, event loop empty (node.js) or when application crash.

官方文档为 https://pm2.keymetrics.io/。

**2023.03.23 补充 :**
为了避免 ssh 长连接和 ssh 用完就关的这两种浪费资源的极端情况，决定放弃采用 pm2 的方式，转而使用全局变量结合进程级错误 `uncaughtException` 的方式来完成 ssh 连接的灵活连接。