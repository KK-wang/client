import Router from "koa-router";
import { getAllNodesMetrics, getNodes } from "../controller/node.controller";
import verifyAuth from "../middleware/verify-auth";

const nodeRouter = new Router();

nodeRouter.get("/getAllNodesMetrics", verifyAuth, getAllNodesMetrics);

nodeRouter.get("/getNodes", verifyAuth, getNodes);



export default nodeRouter;

