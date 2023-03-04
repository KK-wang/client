import Application from "koa";

export namespace DBType {
  export interface IUser {
    id: number,
    username: string,
    password: string,
  }
}

export type Koa = Application & {useRoutes?: () => void}
