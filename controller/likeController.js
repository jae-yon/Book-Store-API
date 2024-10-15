const dbconfig = require('../db');
const mysql = require('mysql2');
const {StatusCodes} = require('http-status-codes');

const conn = mysql.createConnection(dbconfig);

const like = {}

like.addLike = (req, res) => {
  let {id} = req.params;
  let {user_id} = req.body;
  let val = [user_id, parseInt(id)];

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

like.delLike = (req, res) => {
  let {id} = req.params;
  let {user_id} = req.body;
  let val = [user_id, parseInt(id)];

  let sql = `DELETE FROM likes WHERE user_id = ? AND book_id = ?`;

  conn.query(sql, val, function(err, results) {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    return res.status(StatusCodes.OK).json(results);
  });
}

module.exports = like;