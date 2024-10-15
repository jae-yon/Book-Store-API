const dbconfig = require('../db');
const mysql = require('mysql2/promise');
const {StatusCodes} = require('http-status-codes');

const order = {}

order.doOrder = async (req, res) => {
  let {items, delivery, total_quantity, total_price, user_id, represent_book_title} = req.body;
  
  const conn = await mysql.createConnection(dbconfig);

  let sql = `INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)`;
  let val = [delivery.address, delivery.receiver, delivery.contact];
  let [results] = await conn.execute(sql, val);

  let delivery_id = results.insertId;

  sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id)
         VALUES (?, ?, ?, ?, ?)`;
  val = [represent_book_title, total_quantity, total_price, user_id, delivery_id];
  [results] = await conn.execute(sql, val);

  let order_id = results.insertId;

  sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?`;
  
  val = [];
  items.forEach((item) => {
    val.push([order_id, item.book_id, item.quantity]);
  })

  results = await conn.query(sql, [val]);

  return res.status(StatusCodes.CREATED).json(results[0]);
}

order.getOrders = (req, res) => {

}

order.getOrderDetail = (req, res) => {

}

module.exports = order;