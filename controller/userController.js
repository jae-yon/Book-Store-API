const {StatusCodes} = require('http-status-codes');
const connection = require('../db');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const user = {}

user.signup = (req, res) => {
  const {email, password} = req.body;
  const sql = `INSERT INTO users (email, password) VALUES (?, ?)`;
  const val = [email, password];

  connection.query(sql, val, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    res.status(StatusCodes.CREATED).json(results);
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

    if (userInfo && userInfo.password == password) {
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

user.search = (req, res) => {
  const {id} = req.params;
  const sql = `SELECT * FROM users WHERE id = ?`

  connection.query(sql, id, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    res.status(StatusCodes.OK).json(results);
  });
}

module.exports = user;