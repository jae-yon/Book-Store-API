const mysql = require('mysql2');
const {StatusCodes} = require('http-status-codes');

const jwt = require('jsonwebtoken');
const ensureAuthoriation = require('../auth/auth');

const dbconfig = require('../db');
const conn = mysql.createConnection(dbconfig);

const book = {}

book.viewAll = (req, res) => {
  let allBooks = {};
  console.log(req.query);
  let {category_id, news, currentPage, limit} = req.query;
  
  let offset = limit * (currentPage - 1);
  
  let sql = `SELECT SQL_CALC_FOUND_ROWS *, (SELECT count(*) FROM likes WHERE book_id = books.id) AS likes FROM books
  LEFT JOIN category ON books.category_id = category.category_id`;

  let val = [];
  if (category_id && news) {
    val = [parseInt(category_id), news];
    sql += ` WHERE books.category_id = ? AND books.published_at BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
  } else if (category_id) {
    val = [parseInt(category_id)];
    sql += ` WHERE books.category_id = ?`;
  } else if (news) {
    val = [news];
    sql += ` WHERE books.published_at BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
  } 

  sql += ` LIMIT ${parseInt(limit)} OFFSET ${offset}`;

  conn.query(sql, val, function(err, results) {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    if (results.length) {
      /* naming convention : snake case > camel case */
      results.map((result) => {
        result.createdAt = result.created_at;
        result.categoryId = result.category_id;
        result.publishedAt = result.published_at;
        result.categoryName = result.category_name;
        delete result.created_at;
        delete result.category_id;
        delete result.published_at;
        delete result.category_name;
      });
      allBooks.books = results;
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  });

  sql = `SELECT found_rows()`;

  conn.query(sql, val, function(err, results) {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    
    let pagination = {};
    pagination.currentPage = parseInt(currentPage);
    pagination.totalCount =  results[0]["found_rows()"];

    allBooks.pagination = pagination;

    return res.status(StatusCodes.OK).json(allBooks);
  });

}
  

book.viewDetail = (req, res) => {
  let bookId = req.params.id;

  let sql;

  const authorization = ensureAuthoriation(req, res);
  
  if (authorization instanceof jwt.TokenExpiredError) {

    res.status(StatusCodes.UNAUTHORIZED).json({ 
      "message" : "로그인 세션이 만료되었습니다. 다시 로그인 하세요."
    });

  } else if (authorization instanceof jwt.JsonWebTokenError) {
    
    res.status(StatusCodes.BAD_REQUEST).json({
      "message" : "잘못된 토큰입니다."
    });

  } else if (authorization instanceof ReferenceError) {
    // 비로그인 상태
    sql = `SELECT *, 
            (SELECT count(*) FROM likes WHERE book_id = books.id) AS likes 
            FROM books LEFT JOIN category ON books.category_id = category.category_id WHERE books.id = ${bookId}`;
  } else {
    // 로그인 상태
    sql = `SELECT *, 
            (SELECT count(*) FROM likes WHERE book_id = books.id) AS likes, 
            (SELECT EXISTS (SELECT * FROM likes WHERE user_id= ${authorization} AND book_id = ${bookId})) AS liked
            FROM books LEFT JOIN category ON books.category_id = category.category_id WHERE books.id = ${bookId}`;
  }

  conn.query(sql, function(err, results) {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    /* naming convention : snake case > camel case */
    results.map((result) => {
      result.createdAt = result.created_at;
      result.publishedAt = result.published_at;
      result.categoryName = result.category_name;
      delete result.created_at;
      delete result.published_at;
      delete result.category_name;
    });

    const bookInfo = results[0];

    if (bookInfo) {
      return res.status(StatusCodes.OK).json(bookInfo);
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).end();
    }
  });
  
}

module.exports = book;