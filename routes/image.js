const { v4: uuidv4 } = require('uuid');
const Jimp = require('jimp');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/generateImageWithText', async function (req, res, next) {
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

        // Load the font
        const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

        // Calculate position for responsive text at the bottom
        const textWidth = Jimp.measureText(font, randomSentence);
        const textHeight = Jimp.measureTextHeight(font, randomSentence, image.bitmap.width);

        // Add text to the image at the bottom with red color and black border
        image.print(
            font,
            (image.bitmap.width - textWidth) / 2, // Center horizontally
            image.bitmap.height - textHeight - 20, // 20 pixels from the bottom
            randomSentence
        );

        // Convert the modified image to a buffer
        const modifiedImageBuffer = await image.getBufferAsync(Jimp.MIME_PNG);

        // Send the modified image as a response
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': modifiedImageBuffer.length,
        });
        res.end(modifiedImageBuffer);
    } catch (error) {
        console.error('Error generating image with text:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
