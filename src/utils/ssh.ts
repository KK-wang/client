import { NodeSSH } from "node-ssh";
import config from "../definition/vars";

sshUtils.node00.ssh = new NodeSSH();
// node00 不是很稳定，可能会出现服务不可用的情况。
sshUtils.node00.link = () => {
  sshUtils.node00.ssh.connect({
    host: config.NODE00_HOST,
    username: config.NODE00_USERNAME,
    // 如果连接的是 root 用户，默认进入的目录就是 root 用户的根目录。
    port: config.SSH_PORT,
    password: config.NODE00_PASSWORD,
  }).catch(() => Promise.reject(new Error()));
};

sshUtils.node01.ssh = new NodeSSH();
sshUtils.node01.link = () => {
  sshUtils.node01.ssh.connect({
    host: config.NODE01_HOST,
    username: config.NODE01_USERNAME,
    port: config.SSH_PORT,
    password: config.NODE01_PASSWORD,
  }).catch(() => Promise.reject(new Error()));
};

sshUtils.node02.ssh = new NodeSSH();
sshUtils.node02.link = () => {
  sshUtils.node02.ssh.connect({
    host: config.NODE02_HOST,
    username: config.NODE02_USERNAME,
    port: config.SSH_PORT,
    password: config.NODE02_PASSWORD,
  }).catch(() => Promise.reject(new Error()));
};

sshUtils.node00.link();
sshUtils.node01.link();
sshUtils.node02.link();





