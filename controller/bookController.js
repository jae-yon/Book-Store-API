const {StatusCodes} = require('http-status-codes');
const connection = require('../db');

const book = {}

book.viewAll = (req, res) => {
  const {category_id} =req.query;

  if (category_id) {
    const sql = `SELECT * FROM books WHERE category_id = ?`;
  
    connection.query(sql, category_id, function(err, results) {
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
  } else {
    const sql = `SELECT * FROM books`;

    connection.query(sql, function(err, results) {
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
}

book.viewDetail = (req, res) => {
  const {id} = req.params;
  const sql = `SELECT * FROM books WHERE id = ?`;

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