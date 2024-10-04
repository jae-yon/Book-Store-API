const {StatusCodes} = require('http-status-codes');
const connection = require('../db');

const book = {}

book.viewAll = (req, res) => {
  const sql = `SELECT * FROM books`;

  connection.query(sql, function(err, results) {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    res.status(StatusCodes.OK).json(results);
  });
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

book.viewCategory = (req, res) => {

}

module.exports = book;