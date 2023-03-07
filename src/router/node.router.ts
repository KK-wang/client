import Router from "koa-router";
import { getAllNodesMetrics } from "../controller/node.controller";
import verifyAuth from "../middleware/verify-auth";

const nodeRouter = new Router();

nodeRouter.get("/getAllNodesMetrics", verifyAuth, getAllNodesMetrics);



export default nodeRouter;

