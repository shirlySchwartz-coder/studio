import mysql from "mysql2/promise";
import config from "../Utils/config";

const pool = mysql.createPool({
    host: config.mySQLhost,
    user: config.mySQLuser,
    password: config.mySQLpassword,
    database: config.mySQLdb,
    waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

console.log("MySQL pool created");

const execute = async <T = any>(sql: string, params: any[] = []): Promise<T> => {
  try {
    const [rows] = await pool.execute(sql, params);   // <-- correct destructuring
    return rows as T;
  } catch (err) {
    console.error("DB ERROR →", err);
    throw err;               // let router handle it
  }
};

export default { execute };