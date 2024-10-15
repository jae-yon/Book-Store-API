const dbconfig = require('../db');
const mysql = require('mysql2/promise');
const {StatusCodes} = require('http-status-codes');

const order = {}

order.doOrder = async (req, res) => {
  const conn = await mysql.createConnection(dbconfig);
  
  let {items, delivery, total_quantity, total_price, user_id, represent_book_title} = req.body;
  
  // 배송지 정보
  let sql = `INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)`;
  let val = [delivery.address, delivery.receiver, delivery.contact];
  let [results] = await conn.execute(sql, val);

  let delivery_id = results.insertId;
  // 회원 주문 정보
  sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id)
         VALUES (?, ?, ?, ?, ?)`;
  val = [represent_book_title, total_quantity, total_price, user_id, delivery_id];
  [results] = await conn.execute(sql, val);
  // 선택 주문된 장바구니 정보 조회
  sql = `SELECT book_id, quantity FROM cartItems WHERE id IN (?)`;
  let [orderItems, fields] = await conn.query(sql, [items]);

  let order_id = results.insertId;
  // 도서 주문 정보
  sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?`;
  val = [];
  orderItems.forEach((item) => {
    val.push([order_id, item.book_id, item.quantity]);
  })
  results = await conn.query(sql, [val]);

  let finalResult = await deleteCartItems(conn, items);

  return res.status(StatusCodes.CREATED).json(finalResult);
}

order.getOrders = async (req, res) => {
  const conn = await mysql.createConnection(dbconfig);
  const sql = `SELECT orders.id, book_title, total_quantity, total_price, created_at, address, receiver, contact
               FROM orders LEFT JOIN delivery ON orders.delivery_id = delivery.id`;
  const [rows, fields] = await conn.query(sql);
  return res.status(StatusCodes.OK).json(rows);
}

order.getOrderDetail = async (req, res) => {
  const conn = await mysql.createConnection(dbconfig);
  const {id} = req.params;
  const sql = `SELECT book_id, title, author, price, quantity FROM orderedBook
               LEFT JOIN books ON orderedBook.book_id = books.id WHERE order_id = ?`;
  const [rows, fields] = await conn.query(sql, id);
  return res.status(StatusCodes.OK).json(rows);
}

const deleteCartItems = async (conn, items) => {
  const sql = `DELETE FROM cartItems WHERE id IN (?)`;
  return await conn.query(sql, [items]);
}

module.exports = order;