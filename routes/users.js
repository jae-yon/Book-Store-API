var express = require('express');
var router = express.Router();

const user = require('../controller/userController');

router.get('/:id', user.search);

router.post('/signup', user.signup);

router.post('/signin', user.signin);

module.exports = router;
