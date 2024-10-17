const mysql = require('mysql2');
const {StatusCodes} = require('http-status-codes');

/* token */
const jwt = require('jsonwebtoken');
const ensureAuthoriation = require('../auth/auth');

const dbconfig = require('../db');
const conn = mysql.createConnection(dbconfig);

// const authorizeToken = (req) => {
//   try {
//     let receivedToken = req.headers["authorization"];
//     let verifiedToken = jwt.verify(receivedToken, process.env.PRIVATE_KEY);

//     return verifiedToken.id;
//   } catch (error) {
//     console.log(error.name);
//     console.log(error.message);
//     return error;
//   }
// }

const like = {}

like.addLike = (req, res) => {
  let authorization = ensureAuthoriation(req, res);
  let book_id = req.params.id;

  if (authorization instanceof jwt.TokenExpiredError) {

    res.status(StatusCodes.UNAUTHORIZED).json({ message: "Token was expired" });

  } else if (authorization instanceof jwt.JsonWebTokenError) {

    res.status(StatusCodes.BAD_REQUEST).json({ message: "Wrong token" });

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