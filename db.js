const dotenv = require('dotenv');
dotenv.config();

const dbconfig = {
  host: process.env.HOST,
  port: process.env.DB_PORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB,
  timezone: '+09:00',
  dateStrings: true,
};

module.exports = dbconfig;