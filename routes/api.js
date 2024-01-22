const express = require('express');
const router = express.Router();
const jwtUtils = require('../utils/jwt');

router.get('/getImage', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/uploadImage', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/getApiKey', function (req, res, next) {
    const apiToken = jwtUtils.generateToken();
    res.json(apiToken);
});

module.exports = router;
