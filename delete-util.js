const { NodeSSH } = require('node-ssh');

const helper = async (host, username, password) => {
  const ssh = new NodeSSH();
  await ssh.connect({
    host,
    username,
    password,
  });
  await ssh.execCommand("rm -rf ./util.sh");
  ssh.dispose();
  return 0;
}

const replace = async () => {
  const nodes = [
    {
      host: "39.96.212.224",
      username: "root",
      password: "nydus,1234",
    },
    {
      host: "47.115.215.127",
      username: "root",
      password: "wxh20010320..",
    },
    {
      host: "43.136.115.216",
      username: "root",
      password: "wxh20010320..",
    },
    {
      host: "47.120.14.60",
      username: "root",
      password: "Ysx8209190427",
    },
    {
      host: "47.113.201.179",
      username: "root",
      password: "Root123456",
    },
    {
      host: "47.120.8.61",
      username: "root",
      password: "Cmh8209190409",
    }
  ]

  const promiseArr = [];
  for (const node of nodes) {
    promiseArr.push(helper(node.host, node.username, node.password));
  }

  await Promise.all(promiseArr);
  console.log("util.sh has been removed for all nodes");
}

replace();


