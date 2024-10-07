var express = require('express');
var router = express.Router();

var category = require('../controller/categoryController');

router.get('/', category.allCategory);

module.exports = router;