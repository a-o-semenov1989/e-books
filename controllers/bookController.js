const factory = require('./handlerFactory');
const Book = require('../models/bookModel');

exports.getAllBooks = factory.getAll(Book);

exports.getBook = factory.getOne(Book, { path: 'reviews ' });

exports.addNewBook = factory.createOne(Book);

exports.updateBook = factory.updateOne(Book);

exports.deleteBook = factory.deleteOne(Book);
