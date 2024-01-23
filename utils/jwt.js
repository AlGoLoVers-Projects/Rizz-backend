const jwt = require('jsonwebtoken');

const generateToken = () => {
    const payload = {
        localSecret: process.env.LOCAL_SECRET,
        user: process.env.USERNAME,
    };

    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
};

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

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

const generateImageToken = () => {
    const payload = {
        imageSecret: process.env.IMAGE_SECRET,
    };

    return jwt.sign(payload, process.env.JWT_SECRET_KEY);
};

const verifyImageToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (
            decoded.imageSecret !== process.env.IMAGE_SECRET
        ) {
            throw new Error('Invalid claims for image token');
        }

        return decoded;
    } catch (error) {
        console.error(error);
        throw new Error('Invalid image token');
    }
};

module.exports = { generateToken, verifyToken, generateImageToken, verifyImageToken };
