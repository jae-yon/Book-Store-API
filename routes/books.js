var express = require('express');
var router = express.Router();

router.post('/', (req, res) => {
  res.send('도서등록');
});

router.get('/', (req, res) => {
  res.send('도서조회');
});

router.get('/:id', (req, res) => {
  res.send('개별도서조회');
});

router.put('/', (req, res) => {
  res.send('도서상품 정보수정');
});

module.exports = router;