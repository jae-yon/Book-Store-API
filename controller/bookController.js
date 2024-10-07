const {StatusCodes} = require('http-status-codes');
const connection = require('../db');

const book = {}

book.viewAll = (req, res) => {
  let {category_id, new_book, limit, current_page} = req.query;
  let val = [];

  let offset = limit * (current_page - 1);

  let sql = `SELECT * FROM books LEFT JOIN category ON books.category_id = category.id`;

  if (category_id && new_book) {
    val = [parseInt(category_id), new_book];
    sql += ` WHERE books.category_id = ? AND books.published_at BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
  } else if (category_id) {
    val = [parseInt(category_id)];
    sql += ` WHERE books.category_id = ?`;
  } else if (new_book) {
    val = [new_book];
    sql += ` WHERE books.published_at BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
  } 

  sql += ` LIMIT `+ parseInt(limit) +` OFFSET `+ offset;

  connection.query(sql, val, function(err, results) {
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

book.viewDetail = (req, res) => {
  const {id} = req.params;
  const sql = `SELECT * FROM books LEFT JOIN category ON books.category_id = category.id WHERE books.id = ?`;

  connection.query(sql, id, function(err, results) {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    const bookInfo = results[0];

    if (bookInfo) {
      return res.status(StatusCodes.OK).json(bookInfo);
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).end();
    }
  });
}

module.exports = book;