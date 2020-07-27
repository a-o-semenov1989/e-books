const mongoose = require('mongoose');
const slugify = require('slugify');

const bookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A book must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A book name must have less or equal then 40 characters'],
      minlength: [3, 'A book name must have more or equal then 3 characters'],
    },
    slug: String,
    pages: {
      type: Number,
      required: [true, 'A book must have a number of pages'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A book must have a description'],
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    secretBook: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
); //1 объект - schema definiton, 2 - options

//Virtual populate //Доступ ко всем рецензиям к конкретной книге без хранения массива ID рецензий в самой книге
bookSchema.virtual('reviews', {
  ref: 'Review', //reference
  foreignField: 'book', //имя поля в другой модели, где хранится референс к текущей модели //в данном случае поле book в модели Review /и где хранится айди книги
  localField: '_id', //где айди реально хранится здесь в модели Book
});

//DOCUMENT MIDDLEWARE - pre запустится до команд .save() and .create(), но не на update(), и например insertMany(). Можно повлиять на документ до того как он сохранится в БД. post() - после созранения документа в БД
//pre save hook
bookSchema.pre('save', function (next) {
  //у всех middleware есть доступ к next
  this.slug = slugify(this.name, { lower: true }); //this указывает на processed document //console.log(this)
  next(); //вызывает следующи middleware
}); //pre - pre middleware, запустится до ивента, в данном случае - save

//QUERY MIDDLEWARE
bookSchema.pre(/^find/, function (next) {
  //отработает перед поиском и не выдаст в ответе секретные книги
  //find hook значит что это query middleware //благодаря регулярному выражению будет работать с findOne и с find и с т.п. командами - все что начинается с find
  this.find({ secretBook: { $ne: true } });
  this.start = Date.now();
  next(); //this теперь указывает на query, а не на документ
});

bookSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  //console.log(docs); //все полученные в ответе документы
  next();
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
