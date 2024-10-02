var mysql = require('mysql2');
var dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
  host: process.env.HOST,
  port: process.env.DB_PORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB,
  timezone: '+09:00',
  dateStrings: true
});

module.exports = pool;