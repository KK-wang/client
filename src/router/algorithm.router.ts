import Router from "koa-router";import verifyAuth from "../middleware/verify-auth";
import { createAlgorithmTask } from "../controller/algorithm.controller";

const algorithmRouter = new Router();

algorithmRouter.post("/createAlgorithmTask", verifyAuth, createAlgorithmTask);

export default algorithmRouter;

