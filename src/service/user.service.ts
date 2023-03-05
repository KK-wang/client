import { DBType } from "../utils/types";
import dbPromise from "../utils/database";

async function getUserByUsername (username: string): Promise<DBType.IUser> {
  const statement = `SELECT * FROM user WHERE username = ?;`;
  const db = await dbPromise;
  const result = await db.get(statement, username);
  return result; // result 是 any，有时候为了提高编程效率，合理的 any 是必须的。
}

export {
  getUserByUsername,
}