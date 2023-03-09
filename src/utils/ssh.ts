import { NodeSSH } from "node-ssh";

const node01 = new NodeSSH();
const node02 = new NodeSSH();

node01.connect({
  host: "47.115.215.127",
  username: "root",
  port: 22,
  password: "wxh20010320..",
});
// 如果连接的是 root 用户，默认进入的目录就是 root 用户的根目录。

node02.connect({
  host: "43.136.115.216",
  username: "root",
  port: 22,
  password: "wxh20010320..",
});


export default {
  node01,
  node02,
};
