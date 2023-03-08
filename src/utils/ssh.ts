import { NodeSSH } from "node-ssh";
// TODO: 如果 client 部署在 master 节点，那么可以直接调用 master 的 ssh 工具，不需要再使用远程连接。

const node01 = new NodeSSH();
const node02 = new NodeSSH();

node01.connect({
  host: "47.115.215.127",
  username: "client",
  port: 22,
  password: "password",
});

node02.connect({
  host: "43.136.115.216",
  username: "client",
  port: 22,
  password: "password",
});


export default {
  node01,
  node02,
};
