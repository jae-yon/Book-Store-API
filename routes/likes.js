var express = require('express');
var router = express.Router();

router.put('/', (req, res) => {
  res.send('좋아요 선택 또는 취소');
});

module.exports = router;