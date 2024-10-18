const mysql = require('mysql2');
const {StatusCodes} = require('http-status-codes');

const jwt = require('jsonwebtoken');
const ensureAuthoriation = require('../auth/auth');

const dbconfig = require('../db');
const conn = mysql.createConnection(dbconfig);

const cart = {}

cart.addToCart = (req, res) => {
  const {book_id, quantity} = req.body;
  const authorization = ensureAuthoriation(req, res);
  
  if (authorization instanceof jwt.TokenExpiredError) {

    res.status(StatusCodes.UNAUTHORIZED).json({ message: "Token was expired" });

  } else if (authorization instanceof jwt.JsonWebTokenError) {
    
    res.status(StatusCodes.BAD_REQUEST).json({ message: "Wrong token" });

  } else {
    
    const val = [authorization, book_id, quantity];
    
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
  
}

cart.getCartItem = (req, res) => {
  const {selected} = req.body;
  const authorization = ensureAuthoriation(req, res);

  if (authorization instanceof jwt.TokenExpiredError) {

    res.status(StatusCodes.UNAUTHORIZED).json({ message: "Token was expired" });

  } else if (authorization instanceof jwt.JsonWebTokenError) {
    
    res.status(StatusCodes.BAD_REQUEST).json({ message: "Wrong token" });
    
  } else {
    let val =[authorization];

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
      return res.status(StatusCodes.OK).json(results);
    });
  }
}

cart.delCartItem = (req, res) => {
  const cartItemId = req.params.id;
  const sql = `DELETE FROM cartItems WHERE id = ?`;
  
  const authorization = ensureAuthoriation(req, res);

  if (authorization instanceof jwt.TokenExpiredError) {

    res.status(StatusCodes.UNAUTHORIZED).json({ message: "Token was expired" });

  } else if (authorization instanceof jwt.JsonWebTokenError) {
    
    res.status(StatusCodes.BAD_REQUEST).json({ message: "Wrong token" });

  } else {
    conn.query(sql, parseInt(cartItemId), function(err, results) {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }
  
      res.status(StatusCodes.OK).json(results);
    });
  }
}

module.exports = cart;