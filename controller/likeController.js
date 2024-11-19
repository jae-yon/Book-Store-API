const mysql = require('mysql2');
const {StatusCodes} = require('http-status-codes');
/* jwt */
const jwt = require('jsonwebtoken');
const ensureAuthoriation = require('../auth/auth');
/* db */
const dbconfig = require('../db');
const conn = mysql.createConnection(dbconfig);

const like = {}

like.addLike = (req, res) => {
  let authorization = ensureAuthoriation(req, res);
  let book_id = req.params.id;

  if (authorization instanceof jwt.TokenExpiredError) {

    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Token was expired" });

  } else if (authorization instanceof jwt.JsonWebTokenError) {

    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Wrong token" });
  
  } else if (authorization instanceof ReferenceError) {

    return res.status(StatusCodes.UNAUTHORIZED).end();

  } else {

    let val = [authorization, book_id];

    let sql = `INSERT INTO likes (user_id, book_id) VALUES (?, ?)`;

    conn.query(sql, val, function(err, results) {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }

      if (results.affectedRows == 0) {
        return res.status(StatusCodes.BAD_REQUEST).end();
      } else {
        return res.status(StatusCodes.CREATED).json(results);
      }
    });

  }
}

like.delLike = (req, res) => {
  let authorization = ensureAuthoriation(req, res);
  let book_id = req.params.id;

  if (authorization instanceof jwt.TokenExpiredError) {

    res.status(StatusCodes.UNAUTHORIZED).json({ message: "Token was expired" });

  } else if (authorization instanceof jwt.JsonWebTokenError) {

    res.status(StatusCodes.BAD_REQUEST).json({ message: "Wrong token" });
  
  } else if (authorization instanceof ReferenceError) {

    return res.status(StatusCodes.UNAUTHORIZED).end();

  } else {

    let val = [authorization, book_id];

    let sql = `DELETE FROM likes WHERE user_id = ? AND book_id = ?`;

    conn.query(sql, val, function(err, results) {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }

      return res.status(StatusCodes.OK).json(results);
    });
    
  }
  
}

module.exports = like;