import { NodeSSH } from "node-ssh";
import config from "../definition/vars";

const sshUtils: {
  [node: string]: {
    ssh: NodeSSH,
    link: () => void,
  }
} = {};

sshUtils.node00 = {
  // node00 不是很稳定，可能会出现服务不可用的情况。
  ssh: new NodeSSH(),
  link: () => {
    sshUtils.node00.ssh.connect({
      host: config.NODE00_HOST,
      username: config.NODE00_USERNAME,
      // 如果连接的是 root 用户，默认进入的目录就是 root 用户的根目录。
      port: config.SSH_PORT,
      password: config.NODE00_PASSWORD,
      keepaliveInterval: 120000,
      keepaliveCountMax: Number.MAX_VALUE,
    }).catch((err) => Promise.reject(err));
  },
};

sshUtils.node01 = {
  ssh: new NodeSSH(),
  link: () => {
    sshUtils.node01.ssh.connect({
      host: config.NODE01_HOST,
      username: config.NODE01_USERNAME,
      port: config.SSH_PORT,
      password: config.NODE01_PASSWORD,
      keepaliveInterval: 120000,
      keepaliveCountMax: Number.MAX_VALUE,
    }).catch((err) => Promise.reject(err));
  }
}

sshUtils.node02 = {
  ssh: new NodeSSH(),
  link: () => {
    sshUtils.node02.ssh.connect({
      host: config.NODE02_HOST,
      username: config.NODE02_USERNAME,
      port: config.SSH_PORT,
      password: config.NODE02_PASSWORD,
      keepaliveInterval: 120000,
      keepaliveCountMax: Number.MAX_VALUE,
    }).catch((err) => Promise.reject(err));
  }
}

sshUtils.node03 = {
  ssh: new NodeSSH(),
  link: () => {
    sshUtils.node03.ssh.connect({
      host: config.NODE03_HOST,
      username: config.NODE03_USERNAME,
      port: config.SSH_PORT,
      password: config.NODE03_PASSWORD,
      keepaliveInterval: 120000,
      keepaliveCountMax: Number.MAX_VALUE,
    }).catch((err) => Promise.reject(err));
  }
}

sshUtils.node04 = {
  ssh: new NodeSSH(),
  link: () => {
    sshUtils.node04.ssh.connect({
      host: config.NODE04_HOST,
      username: config.NODE04_USERNAME,
      port: config.SSH_PORT,
      password: config.NODE04_PASSWORD,
      keepaliveInterval: 120000,
      keepaliveCountMax: Number.MAX_VALUE,
    }).catch((err) => Promise.reject(err));
  }
}

sshUtils.node05 = {
  ssh: new NodeSSH(),
  link: () => {
    sshUtils.node05.ssh.connect({
      host: config.NODE05_HOST,
      username: config.NODE05_USERNAME,
      port: config.SSH_PORT,
      password: config.NODE05_PASSWORD,
      keepaliveInterval: 120000,
      keepaliveCountMax: Number.MAX_VALUE,
    }).catch((err) => Promise.reject(err));
  }
}

sshUtils.node00.link();
sshUtils.node01.link();
sshUtils.node02.link();
sshUtils.node03.link();
sshUtils.node04.link();
sshUtils.node05.link();

export default sshUtils;





