const express = require('express');
const jwtUtils = require('../utils/jwt');
const router = express.Router();

router.post('/login', function(req, res, next) {
    const { username, credentials } = req.body;

    const expectedUsername = process.env.USERNAME;
    const expectedCredentials = process.env.CREDENTIALS;

    if (username === expectedUsername && credentials === expectedCredentials) {
        const token = jwtUtils.generateToken();
        res.cookie('authToken', token, { httpOnly: true });
        res.redirect('/dashboard');
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

router.get('/logout', function(req, res, next) {
    res.clearCookie('authToken');

    res.redirect('/')
});

module.exports = router;
