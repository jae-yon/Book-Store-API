const {StatusCodes} = require('http-status-codes');
const connection = require('../db');

const like = {}

like.addLike = (req, res) => {
  let {id} = req.params;
  let {user_id} = req.body;
  let val = [user_id, parseInt(id)];

  let sql = `INSERT INTO likes (user_id, book_id) VALUES (?, ?)`;

  connection.query(sql, val, function(err, results) {
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

  connection.query(sql, val, function(err, results) {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    return res.status(StatusCodes.OK).json(results);
  });
}

module.exports = like;