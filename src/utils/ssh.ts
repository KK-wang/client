import { NodeSSH } from "node-ssh";

const node00 = new NodeSSH();
const node01 = new NodeSSH();
const node02 = new NodeSSH();
// FIXME: ssh 是会自动断开的，因此应当每用一次就连接、关闭一次。

node00.connect({
  host: "39.96.212.224",
  username: "root",
  port: 22,
  password: "nydus,1234",
});

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

interface ISSHes {
  [key: string]: NodeSSH
}  

const sshes: ISSHes = {
  "node00": node00,
  "node01": node01,
  "node02": node02,
};

export default sshes;
