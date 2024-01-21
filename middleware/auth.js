const jwtUtils = require('../utils/jwt');

module.exports = (req, res, next) => {
    try {
        const authToken = req.cookies['authToken'];
        if (authToken) {
            const decoded = jwtUtils.verifyToken(authToken);

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
            }
        } else {
            next();
        }
    } catch (error) {
        console.error('Error in authentication middleware:', error);
        next();
    }
};
