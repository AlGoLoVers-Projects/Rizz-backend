const express = require('express');
const router = express.Router();
const jwtUtils = require('../utils/jwt');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '..', 'images');

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

router.post('/uploadImage', upload.array('images'), function (req, res, next) {
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

router.get('/getImages', function (req, res, next) {
    const imagesFolder = path.join(__dirname, '..', 'images');

    fs.readdir(imagesFolder, (err, files) => {
        if (err) {
            console.error('Error reading images folder:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
        const imageArray = imageFiles.map(file => {
            const filePath = path.join(imagesFolder, file);
            const fileContent = fs.readFileSync(filePath, 'base64'); // Read file content as base64

            return {
                filename: file,
                content: fileContent,
                // Add other relevant file data as needed
            };
        });

        res.json({ images: imageArray });
    });
});

router.delete('/deleteImage/:filename', function (req, res, next) {
    const filename = req.params.filename;
    const imagesFolder = path.join(__dirname, '..', 'images');
    const filePath = path.join(imagesFolder, filename);

    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting image:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            res.json({
                success: true,
                message: 'Image deleted successfully',
                filename: filename,
            });
        });
    } else {
        res.status(404).json({ error: 'Image not found' });
    }
});


router.get('/getApiKey', function (req, res, next) {
    const apiToken = jwtUtils.generateImageToken();
    res.json({
        token: apiToken,
        success: true,
        message: 'Login successful'
    });
});

router.post('/saveRizz', function (req, res, next) {
    const { rizz } = req.body;

    console.log(rizz);

    if (!rizz) {
        return res.status(400).json({ error: 'Parameter "rizz" is required.' });
    }

    const jsonFilePath = path.join(__dirname, '..', 'rizz.json');

    try {
        // Validate if the input is a valid JSON array

        if (!Array.isArray(rizz)) {
            return res.status(400).json({ error: 'Invalid JSON array.' });
        }

        // Write the parsed array directly to the file, overwriting existing data
        fs.writeFileSync(jsonFilePath, JSON.stringify(rizz, null, 2));

        res.json({ success: true, message: 'Rizz saved successfully.' });
    } catch (error) {
        console.error('Error saving Rizz:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/getRizz', function (req, res, next) {
    const jsonFilePath = path.join(__dirname, '..', 'rizz.json');

    try {
        const rizzData = fs.existsSync(jsonFilePath)
            ? JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'))
            : [];

        res.json({ rizz: rizzData });
    } catch (error) {
        console.error('Error fetching Rizz:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
