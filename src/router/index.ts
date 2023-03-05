import fs from "fs";
import Router from "koa-router";
import { Koa } from "../utils/types";


export default function useRoutes(this: Koa): void {
  fs.readdirSync(__dirname).forEach(async (file) => {
    if (file.slice(0, -3) === "index") return;
    const module = await import(`./${file}`);
    const router: Router = (module.default) as Router;
    this.use(router.routes());
    this.use(router.allowedMethods());
  });
}