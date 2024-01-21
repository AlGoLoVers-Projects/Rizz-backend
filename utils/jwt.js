const jwt = require('jsonwebtoken');

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const generateToken = (localSecret, user) => {
    const payload = {
        localSecret,
        user,
    };

    return jwt.sign(payload, JWT_SECRET_KEY, {expiresIn: '1h'});
};

const verifyToken = (token, expectedClaims) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY);

        if (expectedClaims) {
            for (const claim in expectedClaims) {
                if (decoded[claim] !== expectedClaims[claim]) {
                    throw new Error(`Claim '${claim}' does not match`);
                }
            }
        }

        return decoded;
    } catch (error) {
        throw new Error('Invalid token');
    }
};

module.exports = { generateToken, verifyToken };
