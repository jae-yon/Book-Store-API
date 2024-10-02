var express = require('express');
var router = express.Router();

router.post('/', (req, res) => {
  res.send('장바구니 담기');
});

router.get('/', (req, res) => {
  res.send('장바구니 조회');
});

router.delete('/', (req, res) => {
  res.send('장바구니 삭제');
});

module.exports = router;