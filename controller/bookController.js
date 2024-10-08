const {StatusCodes} = require('http-status-codes');
const connection = require('../db');

const book = {}

book.viewAll = (req, res) => {
  let {category_id, new_book, limit, current_page} = req.query;
  let val = [];

  let offset = limit * (current_page - 1);

  let sql = `SELECT *, (SELECT count(*) FROM likes WHERE book_id = books.id) AS likes FROM books
             LEFT JOIN category ON books.category_id = category.category_id`;

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
  let {id} = req.params;
  let {user_id} = req.body;
  const sql = `SELECT *, 
	            (SELECT count(*) FROM likes WHERE book_id = books.id) AS likes, 
	            (SELECT EXISTS (SELECT * FROM likes WHERE user_id= ${user_id} AND book_id = ${id})) AS liked
	            FROM books LEFT JOIN category ON books.category_id = category.category_id WHERE books.id = ${id}`;

  connection.query(sql, function(err, results) {
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