import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const PRIVATE_KEY = fs.readFileSync(path.resolve(__dirname, './keys/private.key')).toString();
const PUBLIC_KEY = fs.readFileSync(path.resolve(__dirname, './keys/public.key')).toString();

const config: IConfig = {
  APP_PORT: process.env.APP_PORT!,
  DATABASE_PATH: process.env.DATABASE_PATH!,
  PRIVATE_KEY,
  PUBLIC_KEY,
}

export default config;

interface IConfig {
  APP_PORT: string,
  DATABASE_PATH: string,
  PRIVATE_KEY: string,
  PUBLIC_KEY: string,
}