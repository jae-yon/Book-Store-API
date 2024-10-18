const mysql = require('mysql2');
const {StatusCodes} = require('http-status-codes');

const jwt = require('jsonwebtoken');
const ensureAuthoriation = require('../auth/auth');

const dbconfig = require('../db');
const conn = mysql.createConnection(dbconfig);

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

  sql += ` LIMIT ${parseInt(limit)} OFFSET ${offset}`;

  conn.query(sql, val, function(err, results) {
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
  let bookId = req.params.id;

  const authorization = ensureAuthoriation(req, res);
  
  if (authorization instanceof jwt.TokenExpiredError) {

    res.status(StatusCodes.UNAUTHORIZED).json({ message: "Token was expired" });

  } else if (authorization instanceof jwt.JsonWebTokenError) {
    
    res.status(StatusCodes.BAD_REQUEST).json({ message: "Wrong token" });

  } else if (authorization instanceof ReferenceError) {
    const sql = `SELECT * FROM books LEFT JOIN category ON books.category_id = category.category_id WHERE books.id = ${bookId}`;
  } else {
    const sql = `SELECT *, 
	            (SELECT count(*) FROM likes WHERE book_id = books.id) AS likes, 
	            (SELECT EXISTS (SELECT * FROM likes WHERE user_id= ${authorization} AND book_id = ${bookId})) AS liked
	            FROM books LEFT JOIN category ON books.category_id = category.category_id WHERE books.id = ${bookId}`;
  }

  conn.query(sql, function(err, results) {
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