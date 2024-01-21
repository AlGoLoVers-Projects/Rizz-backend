var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/getImage', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/uploadImage', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/getApiKey', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
