const { v4: uuidv4 } = require('uuid');
const Jimp = require('jimp');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/generateImageWithRizz', async function (req, res, next) {
    try {
        // Fetch all images
        const imagesFolder = path.join(__dirname, '..', 'images');
        const imageFiles = fs.readdirSync(imagesFolder);
        const randomImage = imageFiles[Math.floor(Math.random() * imageFiles.length)];
        const imagePath = path.join(imagesFolder, randomImage);

        // Load the image using Jimp
        const image = await Jimp.read(imagePath);

        // Fetch all sentences from rizz.json
        const jsonFilePath = path.join(__dirname, '..', 'rizz.json');
        const sentences = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));

        // Select a random sentence
        const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];

        // Convert the modified image to a base64-encoded string
        const base64Image = await image.getBase64Async(Jimp.MIME_PNG);

        // Send the base64-encoded image and the random rizz sentence in the response
        res.json({ base64Image, randomSentence });
    } catch (error) {
        console.error('Error generating image with text:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
