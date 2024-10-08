var express = require('express');
var router = express.Router();

var like = require('../controller/likeController');

router.post('/:id', like.addLike);

router.delete('/:id', like.delLike);

module.exports = router;