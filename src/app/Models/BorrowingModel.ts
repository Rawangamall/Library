import { NextFunction } from "express";

const { Schema, model } = require('mongoose');

const bookBorrowingSchema = new Schema({
  book: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  borrower: {
    type: Number,
    ref: 'Borrower',
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  returned: {
    type: Boolean,
    default: false
  },
  rentalFee: {
    type: Number, // total price for rental books
    default: 0
  } ,
  sessionId:{   //trans payment id for rental books
    type:String,
    required:false,
    default:null
  }
}, { timestamps: true });


const BorrowingModel = model('Borrowing', bookBorrowingSchema);

export default BorrowingModel;
