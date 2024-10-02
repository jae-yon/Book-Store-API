var express = require('express');
var router = express.Router();

router.post('/signup', (req, res) => {
  res.send('회원가입');
});

router.post('/signup', (req, res) => {
  res.send('회원가입');
});

router.get('/:id', (req, res) => {
  res.send('회원정보');
});

router.put('/', (req, res) => {
  res.send('회원정보 수정');
});

module.exports = router;
