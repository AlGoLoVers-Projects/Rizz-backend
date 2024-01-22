const express = require('express');
const jwtUtils = require('../utils/jwt');
const router = express.Router();

router.post('/login', function (req, res) {
    const {username, credentials} = req.body;

    const expectedUsername = process.env.USERNAME;
    const expectedCredentials = process.env.CREDENTIALS;

    if (username === expectedUsername && credentials === expectedCredentials) {
        const token = jwtUtils.generateToken();

        return res
            .status(200)
            .json({
                token: token,
                success: true,
                message: 'Login successful'
            });

    } else {
        res.status(401).json({success: true, message: 'Invalid credentials'});
    }
});

router.get('/verifyToken', (req, res, next) => {
    const authToken = req.body.token

    if (authToken) {
        const decoded = jwtUtils.verifyToken(authToken);

        if (decoded) {
            req.user = decoded;

            return res
                .status(200)
                .json({
                    success: true,
                    message: 'Verification successful'
                });

        }
    }

    res.status(401).json({success: false, message: 'Verification failed'});
});

module.exports = router;
