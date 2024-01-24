"use strict";
const { BookBorrowing } = require('./../Models/BorrowingModel');
const JWT = require("jsonwebtoken");
const { promisify } = require("util");
const CatchAsync = require('./../Utils/CatchAsync');
class BorrowingOperations {
    static test = "heelo";
    static logBookBorrowing() {
        console.log(BookBorrowing);
    }
}
// Call the method to log BookBorrowing
BorrowingOperations.logBookBorrowing();
