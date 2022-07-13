const config = require('./utils/config');
const logger = require('./utils/logger');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');
const middleware = require('./utils/middleware');
const contactsRouter = require('./controllers/contacts');
const morgan = require('morgan');

logger.info('Connecting to MongoDB...');
mongoose.connect(config.DB_URI)
        .then(_res => logger.info('Connected to MongoDB'))
        .catch(err => logger.error('Error connecting to MongoDB:', err.message));

process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
  });
});

app.use(cors()); // enable CORS
app.use(express.static('build')); // serve static files from build directory if request matches one of its files
app.use(express.json()); // parse HTTP request bodies into JSON, attach to body property on request objects
morgan.token('body', function(req, _res) { return JSON.stringify(req.body) });
app.use(morgan(':method :url HTTP/:http-version :body')); // log all http request info to std out

app.use('/api/contacts', contactsRouter);

app.use(middleware.unknownRoute);
app.use(middleware.errorHandler);

module.exports = app;