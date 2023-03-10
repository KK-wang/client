import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const PRIVATE_KEY = fs.readFileSync(path.resolve(__dirname, '../config/keys/private.key')).toString();
const PUBLIC_KEY = fs.readFileSync(path.resolve(__dirname, '../config/keys/public.key')).toString();

const config: IConfig = {
  APP_PORT: process.env.APP_PORT!,
  DATABASE_PATH: process.env.DATABASE_PATH!,
  SSH_PORT: parseInt(process.env.SSH_PORT!),
  KEEP_ALIVE_INTERVAL: parseInt(process.env.KEEP_ALIVE_INTERVAL!),
  KEEP_ALIVE_COUNT_MAX: Number.MAX_VALUE,
  NODE00_HOST: process.env.NODE00_HOST!,
  NODE00_USERNAME: process.env.NODE00_USERNAME!,
  NODE00_PASSWORD: process.env.NODE00_PASSWORD!,
  NODE01_HOST: process.env.NODE01_HOST!,
  NODE01_USERNAME: process.env.NODE01_USERNAME!,
  NODE01_PASSWORD: process.env.NODE01_PASSWORD!,
  NODE02_HOST: process.env.NODE02_HOST!,
  NODE02_USERNAME: process.env.NODE02_USERNAME!,
  NODE02_PASSWORD: process.env.NODE02_PASSWORD!,
  PRIVATE_KEY,
  PUBLIC_KEY,
}

export default config;

interface IConfig {
  APP_PORT: string,
  DATABASE_PATH: string,
  SSH_PORT: number,
  KEEP_ALIVE_INTERVAL: number,
  KEEP_ALIVE_COUNT_MAX: number,
  PRIVATE_KEY: string,
  PUBLIC_KEY: string,
  NODE00_HOST: string,
  NODE00_USERNAME: string,
  NODE00_PASSWORD: string,
  NODE01_HOST: string,
  NODE01_USERNAME: string,
  NODE01_PASSWORD: string,
  NODE02_HOST: string,
  NODE02_USERNAME: string,
  NODE02_PASSWORD: string,
}