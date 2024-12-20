const dbconfig = require('../db');
const mysql = require('mysql2');
const {StatusCodes} = require('http-status-codes');

const conn = mysql.createConnection(dbconfig);

const category = {}

category.allCategory = (req, res) => {
  
  let sql = "SELECT category_id AS id, category_name AS name FROM category";

  conn.query(sql, function(err, results) {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    results.map((result) => {
      result.categoryId = result.category_id;
      result.categoryName = result.category_name;
      delete result.category_id;
      delete result.category_name;
    });

    if (results.length) {
      res.status(StatusCodes.CREATED).json(results);
    } else {
      res.status(StatusCodes.NOT_FOUND).end();
    }
  });
}

module.exports = category;