var express = require('express');
var router = express.Router();

var cart = require('../controller/cartController');

router.post('/', cart.addToCart);

router.get('/', cart.getCartItem);

router.delete('/:id', cart.delCartItem);

module.exports = router;