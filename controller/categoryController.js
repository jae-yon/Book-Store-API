const dbconfig = require('../db');
const mysql = require('mysql2');
const {StatusCodes} = require('http-status-codes');

const conn = mysql.createConnection(dbconfig);

const category = {}

category.allCategory = (req, res) => {
  
  const sql = `SELECT * FROM category`;

  conn.query(sql, function(err, results) {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    if (results.length) {
      res.status(StatusCodes.CREATED).json(results);
    } else {
      res.status(StatusCodes.NOT_FOUND).end();
    }
  });
}

module.exports = category;