const { NodeSSH } = require('node-ssh');

const upload = async () => {
  const ssh = new NodeSSH();

  try {
    await ssh.connect({
      host: "39.96.212.224",
      username: "root",
      password: "nydus,1234",
    });
    console.log('server connected');
  } catch (e) {
    console.log(e);
  }

  await ssh.execCommand(`rm -rf ./koa-server/src/*`);

  try {
    const status = await ssh.putDirectory("./src", "./koa-server/src", {
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