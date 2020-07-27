const express = require('express');

const bookRouter = require('./routes/bookRoutes');

const app = express();

app.use('/api/v1/books', bookRouter);

module.exports = app;
