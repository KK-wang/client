import { NodeSSH } from "node-ssh";

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
