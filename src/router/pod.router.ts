import Router from "koa-router";
import verifyAuth from "../middleware/verify-auth";
import { createPods, getAllPods } from "../controller/pod.controller";

const podRouter = new Router();

podRouter.get("/:namespace/getAllPods", verifyAuth, getAllPods);

podRouter.post("/createPods", verifyAuth, createPods);
/**
 * 一个经典的在特定 Node 上执行的 Pod yaml 如下：
 * 
    apiVersion: v1
    kind: Pod
    metadata:
      name: nginx
    spec:
      containers:
      - name: nginx
        image: nginx
      nodeName: node01
 * 
 */

export default podRouter;

