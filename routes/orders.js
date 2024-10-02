var express = require('express');
var router = express.Router();

router.post('/', (req, res) => {
  res.send('주문 요청');
});

router.get('/', (req, res) => {
  res.send('주문서 생성');
});

router.get('/', (req, res) => {
  res.send('주문 조회');
});

module.exports = router;