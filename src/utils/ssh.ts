import { NodeSSH } from "node-ssh";
import config from "../definition/vars";

const node00 = new NodeSSH();
const node01 = new NodeSSH();
const node02 = new NodeSSH();

node00.connect({
  host: config.NODE00_HOST,
  username: config.NODE00_USERNAME,
  port: config.SSH_PORT,
  password: config.NODE00_PASSWORD,
  keepaliveInterval: config.KEEP_ALIVE_INTERVAL,
  keepaliveCountMax: config.KEEP_ALIVE_COUNT_MAX,
});

node01.connect({
  host: config.NODE01_HOST,
  username: config.NODE01_USERNAME,
  port: config.SSH_PORT,
  password: config.NODE01_PASSWORD,
  keepaliveInterval: config.KEEP_ALIVE_INTERVAL, // 每隔多长毫秒发送一次心跳。
  keepaliveCountMax: config.KEEP_ALIVE_COUNT_MAX, // 心跳的发送次数。
});
// 如果连接的是 root 用户，默认进入的目录就是 root 用户的根目录。

node02.connect({
  host: config.NODE02_HOST,
  username: config.NODE02_USERNAME,
  port: config.SSH_PORT,
  password: config.NODE02_PASSWORD,
  keepaliveInterval: config.KEEP_ALIVE_INTERVAL,
  keepaliveCountMax: config.KEEP_ALIVE_COUNT_MAX,
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
