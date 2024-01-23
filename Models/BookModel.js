const { Schema, model } = require('mongoose');

const bookSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  availableQuantity: {
    type: Number,
    required: true,
    default: 0
  },
  shelfLocation: {
    type: String,   //Hierarchical as Floor-Section-Shelf : 2-3A-105
    required: true,
    unique: true
  }
}, { timestamps: false });

const Book = model('Book', bookSchema);

module.exports = Book;
