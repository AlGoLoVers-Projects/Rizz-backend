const jwtUtils = require('../utils/jwt');

module.exports = (req, res, next) => {
    try {
        const authToken = req.headers.authorization

        if (authToken) {
            const decoded = jwtUtils.verifyImageToken(authToken);

            if (decoded) {
                next();
                return
            }
        }

        return res.status(401).json({success: false, message: 'Verification failed for image auth'});
    } catch (error) {
        console.error('Error in image authentication middleware:', error);
        return res.status(401).json({success: false, message: 'Verification failed'});
    }
};
