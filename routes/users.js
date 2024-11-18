var express = require('express');
var router = express.Router();

const user = require('../controller/userController');

router.get('/:id', user.profile);

router.post('/join', user.signup);

router.post('/login', user.signin);

router.post('/reset', user.checkEmail);

router.put('/reset', user.resetInfo);

module.exports = router;
