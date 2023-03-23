const { NodeSSH } = require('node-ssh');

const upload = async () => {
  const ssh = new NodeSSH();

  try {
    await ssh.connect({
      host: "47.113.144.248",
      username: "root",
      password: "wxh20010320..",
    });
    console.log('server connected');
  } catch (e) {
    console.log(e);
  }

  await ssh.execCommand(`rm -rf ./koa-server/server/*`);

  try {
    const status = await ssh.putDirectory("./dist", "./koa-server/server", {
      recursive: true,
      concurrency: 10
    });
    console.log('isSuccess? ', status);
  } catch (e) {
    console.log(e);
  }

  ssh.dispose();
};

upload();