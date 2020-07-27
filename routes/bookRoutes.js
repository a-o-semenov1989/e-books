const express = require('express');

const bookController = require('../controllers/bookController');

const router = express.Router();

router
  .route('/')
  .get(bookController.getAllBooks)
  .post(bookController.addNewBook);

router
  .route('/:id')
  .get(bookController.getBook)
  .delete(bookController.deleteBook)
  .patch(bookController.updateBook);
