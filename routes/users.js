var express = require('express');
var router = express.Router();

const user = require('../controller/userController');

router.get('/:id', user.profile);

router.post('/signup', user.signup);

router.post('/signin', user.signin);

router.post('/edit', user.checkEmail);

router.put('/edit', user.resetInfo);

module.exports = router;
