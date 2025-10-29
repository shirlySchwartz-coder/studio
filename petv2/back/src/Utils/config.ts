import e from 'express';
import { env } from 'process';
require('dotenv').config();

class Config{
  public webPort = env.DB_PORT ;
    public webHost = env.DB_HOST ;
    public mySQLhost =  env.MY_SQL_HOST || 'localhost';
    public mySQLuser = env.DB_USER;
    public mySQLpassword = env.DB_PASSWORD ;
    public mySQLdb =  env.DB_NAME ;
};
const config = new Config();
export default config;