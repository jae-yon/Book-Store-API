const {StatusCodes} = require('http-status-codes');
const connection = require('../db');

const order = {}

order.doOrder = (req, res) => {
  let {items, delivery, total_quantity, total_price, user_id, represent_book_title} = req.body;
  let sql = `INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)`;
  let val = [delivery.address, delivery.receiver, delivery.contact];

  let delivery_id = 0;
  let order_id = 0;
  // insert into delivery
  connection.query(sql, val, function(err, results) {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    delivery_id= results.insertId;

    res.status(StatusCodes.CREATED).json(results);

  });
  // insert into orders
  // sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id)
  //        VALUES (?, ?, ?, ?, ?)`;
  
  // val = [represent_book_title, total_quantity, total_price, user_id, delivery_id];

  // connection.query(sql, val, function(err, results) {
  //   if (err) {
  //     console.log(err);
  //     return res.status(StatusCodes.BAD_REQUEST).end();
  //   }

    // order_id = results.insertId;

  //   res.status(StatusCodes.CREATED).json(results);

  // });

  // insert into orderedBook
  // val = [];
  
  // sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?`;
  
  // items.forEach((item) => {
  //   val.push([order_id, item.book_id, item.quantity]);
  // })
  // console.log(val);
  
  // connection.query(sql, [val], function(err, results) {
  //   if (err) {
  //     console.log(err);
  //     return res.status(StatusCodes.BAD_REQUEST).end();
  //   }

  //   res.status(StatusCodes.CREATED).json(results);

  // });
}

order.getOrders = (req, res) => {

}

order.getOrderDetail = (req, res) => {

}

module.exports = order;