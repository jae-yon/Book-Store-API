var express = require('express');
var router = express.Router();

var book = require('../controller/bookController');

router.get('/', book.viewAll);

router.get('/:id', book.viewDetail);

router.get('/', book.viewCategory);

module.exports = router;