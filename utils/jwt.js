const jwt = require('jsonwebtoken');

const generateToken = () => {
    const payload = {
        localSecret: process.env.LOCAL_SECRET,
        user: process.env.USERNAME,
    };

    console.log(payload)

    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
};

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        console.log(decoded, process.env.LOCAL_SECRET, process.env.USERNAME)

        // Check specific claims
        if (
            decoded.localSecret !== process.env.LOCAL_SECRET ||
            decoded.user !== process.env.USERNAME
        ) {
            throw new Error('Invalid claims');
        }

        return decoded;
    } catch (error) {
        console.error(error);
        throw new Error('Invalid token');
    }
};

module.exports = { generateToken, verifyToken };
