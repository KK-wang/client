/** 
 * 连接数据库，同时获取数据库的操作对象。
 * 没有必要每次操作完成都 close 数据库，这里是 sqlite 作者的回答：
 * https://stackoverflow.com/questions/15720272/when-to-close-sqlite-database-using-fmdb
 */
// sqlite 是 sqlite 的 Promise 版本。
import * as sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import config from "../definition/vars";


async function SQLiteInit() {
  const db = await open({
    filename: path.join(__dirname, config.DATABASE_PATH),
    driver: sqlite3.Database
  });
  console.log("Welcome to the sqlite database.");
  return db;
}

export default SQLiteInit();
