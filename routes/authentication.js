const express = require('express');
const jwtUtils = require('../utils/jwt');
const router = express.Router();

router.post('/login', function(req, res, next) {
    const { username, credentials } = req.body;

    const expectedUsername = process.env.USER;
    const expectedCredentials = process.env.CREDENTIALS;

    if (username === expectedUsername && credentials === expectedCredentials) {
        const token = jwtUtils.generateToken(process.env.LOCAL_SECRET, process.env.USER);
        res.cookie('authToken', token, { httpOnly: true });

        res.json({ message: 'Login successful', token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

router.post('/logout', function(req, res, next) {
    res.clearCookie('authToken');

    res.json({ message: 'Logout successful' });
});

module.exports = router;
