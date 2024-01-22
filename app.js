const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv')
const authenticate = require('./middleware/auth')

dotenv.config();

const authenticationRouter = require('./routes/authentication')
const apiRouter = require('./routes/api');

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

app.use('/auth', authenticationRouter);
app.use('/api', authenticate, apiRouter)

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './frontend/build', 'index.html'));
});

module.exports = app;
