const jwtUtils = require('../utils/jwt');

module.exports = (req, res, next) => {
    try {
        const authToken = req.cookies['authToken'];

        console.log(authToken)

        if (authToken) {
            const decoded = jwtUtils.verifyToken(authToken, {
                localSecret: process.env.LOCAL_SECRET,
                user: process.env.USER
            });

            console.log(decoded)

            if (decoded) {
                req.user = decoded;

                console.log(req.originalUrl)

                if (req.originalUrl === '/') {
                    return res.redirect('/dashboard');
                }

                next();
            } else {
                res.clearCookie('authToken');
                res.redirect('/');
            }
        } else {
            res.redirect('/');
        }
    } catch (error) {
        console.error('Error in authentication middleware:', error);
        res.redirect('/');
    }
};
