const { NodeSSH } = require('node-ssh');
const ProgressBar = require('cli-progress');

// 使用 Linux 压测工具 stress 来模拟不同负载的 node 情况。

const CPUCoreConfig = {
  node00: 4, // node00 共有 16 核。
  node01: 1, // node01 共有 2 核。
  node02: 0, // node02 共有 2 核。
  node03: 1, // node03 共有 2 核。
  node04: 0, // node04 共有 2 核。
  node05: 1, // node05 共有 2 核。
};

const time = 1200; // 单位为秒。

const nodes = [
  {
    host: "39.96.212.224",
    username: "root",
    password: "nydus,1234",
    CPUCore: CPUCoreConfig["node00"]
  },
  {
    host: "47.115.215.127",
    username: "root",
    password: "wxh20010320..",
    CPUCore: CPUCoreConfig["node01"]
  },
  {
    host: "43.136.115.216",
    username: "root",
    password: "wxh20010320..",
    CPUCore: CPUCoreConfig["node02"]
  },
  {
    host: "47.120.14.60",
    username: "root",
    password: "Ysx8209190427",
    CPUCore: CPUCoreConfig["node03"]
  },
  {
    host: "47.113.201.179",
    username: "root",
    password: "Root123456",
    CPUCore: CPUCoreConfig["node04"]
  },
  {
    host: "47.120.8.61",
    username: "root",
    password: "Cmh8209190409",
    CPUCore: CPUCoreConfig["node05"]
  }
]

const progressBar = new ProgressBar.SingleBar({
  // 创建进度条实例。
  format: 'Progress |{bar}| {percentage}% || {value}/{total} Items',
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  hideCursor: true
});

progressBar.start(6, 0); // 启动进度条。

const helper = async (node) => {
  const ssh = new NodeSSH();
  await ssh.connect({
    "host": node.host,
    "username": node.username,
    "password": node.password,
  });
  await ssh.execCommand(`stress --cpu ${node.CPUCore} --timeout ${time}`);
  ssh.dispose();
}

let len = 0 // 进度条长度。 

const stress = async () => {
  const promiseArr = [];
  for (const node of nodes)
    promiseArr.push(helper(node).then(() => {
      progressBar.update(len + 1);
      len++;
      return Promise.resolve();
    }))
  await Promise.all(promiseArr);
  console.log("\n\nAll nodes have been run command stress.");
  process.exit(0);
}

stress()



