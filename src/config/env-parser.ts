import * as dotenv from "dotenv";

dotenv.config();

const config: IConfig = {
  APP_PORT: process.env.APP_PORT!,
  DATABASE_PATH: process.env.DATABASE_PATH!,
}

export default config;

interface IConfig {
  APP_PORT: string,
  DATABASE_PATH: string,
}