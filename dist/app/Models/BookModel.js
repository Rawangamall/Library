"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        type: String, //Hierarchical as Floor-Section-Shelf : 2-A-105
        required: true,
        unique: true
    },
    bookType: {
        type: String,
        required: true,
        enum: ['rental', 'free']
    },
    rentalFee: {
        type: Number,
        required: true,
        default: 0
    },
    sales: {
        type: Number,
        required: true,
        default: 0
    },
    rating: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true });
bookSchema.index({ rating: -1 }, { partialFilterExpression: { rating: { $in: [9, 10] } } });
const Book = model('Book', bookSchema);
exports.default = Book;
