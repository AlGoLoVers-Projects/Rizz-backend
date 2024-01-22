const express = require('express');
const router = express.Router();
const jwtUtils = require('../utils/jwt');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'images');

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const randomFilename = uuidv4();
        const fileExtension = path.extname(file.originalname);
        const newFilename = `${randomFilename}${fileExtension}`;

        cb(null, newFilename);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images (JPEG, PNG, GIF) are allowed.'));
    }
};
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
});

router.post('/uploadImage', upload.array('images', 5), function (req, res, next) {
    const uploadedFiles = req.files;

    res.json({
        success: true,
        message: 'Files uploaded successfully',
        files: uploadedFiles.map(file => ({
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            path: file.path,
        })),
    });
});

router.get('/getImage', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/getApiKey', function (req, res, next) {
    const apiToken = jwtUtils.generateImageToken();
    res.json({
        token: apiToken,
        success: true,
        message: 'Login successful'
    });
});

module.exports = router;
