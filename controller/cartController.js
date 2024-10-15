const dbconfig = require('../db');
const mysql = require('mysql2');
const {StatusCodes} = require('http-status-codes');

const conn = mysql.createConnection(dbconfig);

const cart = {}

cart.addToCart = (req, res) => {
  const {book_id, user_id, quantity} = req.body;
  const val = [user_id, book_id, quantity];
  
  const sql = `INSERT INTO cartItems (user_id, book_id, quantity) VALUES (?, ?, ?)`;

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

cart.getCartItem = (req, res) => {
  let {user_id, selected} = req.body;
  
  let val =[user_id];
  
  let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price
             FROM cartItems LEFT JOIN books ON cartItems.book_id = books.id 
             WHERE user_id = ?`;
  
  if (selected) {
    val.push(selected);
    sql += ` AND cartItems.id IN (?)`;
  }

  conn.query(sql, val, function(err, results) {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    res.status(StatusCodes.OK).json(results);
  });
}

cart.delCartItem = (req, res) => {
  const {id} = req.params;
  const sql = `DELETE FROM cartItems WHERE id = ?`;

  conn.query(sql, parseInt(id), function(err, results) {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    res.status(StatusCodes.OK).json(results);
  });
}

module.exports = cart;