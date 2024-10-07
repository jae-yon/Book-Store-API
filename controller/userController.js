const {StatusCodes} = require('http-status-codes');
const connection = require('../db');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();

const user = {}

user.signup = (req, res) => {
  const {email, password} = req.body;
  const sql = `INSERT INTO users (email, password, salt) VALUES (?, ?, ?)`;

  const salt = crypto.randomBytes(10).toString('base64');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');

  const val = [email, hash, salt];

  connection.query(sql, val, (err, results) => {
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

user.signin = (req, res) => {
  const {email, password} = req.body;
  const sql = 'SELECT * FROM users WHERE email = ?';

  connection.query(sql, email, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    const userInfo = results[0];

    const hash = crypto.pbkdf2Sync(password, userInfo.salt, 10000, 10, 'sha512').toString('base64');

    if (userInfo && userInfo.password == hash) {
      const token = jwt.sign(
        {
          email: userInfo.email
        },
        process.env.PRIVATE_KEY, 
        {
            expiresIn: '5m',
            issuer: 'tester'
        }
      );

      res.cookie('token', token, { httpOnly : true });
      console.log(token);

      return res.status(StatusCodes.OK).json(results);
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).end();
    }
  });
}

user.checkEmail = (req, res) => {
  const {email} = req.body;
  const sql = `SELECT * FROM users WHERE email = ?`;

  connection.query(sql, email, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    const userInfo = results[0];

    if (userInfo) {
      return res.status(StatusCodes.OK).json({ email: email });
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).end();
    }
  });
}

user.resetInfo = (req, res) => {
  const {email, password} = req.body;
  const sql = `UPDATE usese SET password = ?, salt = ? WHERE email = ?`;
  
  const salt = crypto.randomBytes(10).toString('base64');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');
  
  const val = [email, hash, salt];
  
  connection.query(sql, val, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    if (results.affectedRows == 0) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    } else {
      return res.status(StatusCodes.OK).json(results);
    }
  });
}

user.profile = (req, res) => {
  const {id} = req.params;
  const sql = `SELECT * FROM users WHERE id = ?`;

  connection.query(sql, id, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    res.status(StatusCodes.OK).json(results);
  });
}

module.exports = user;