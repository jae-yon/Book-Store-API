var express = require('express');
var router = express.Router();

var order = require('../controller/orderController');

router.post('/', order.doOrder);

router.get('/', order.getOrders);

router.get('/:id', order.getOrderDetail);

module.exports = router;