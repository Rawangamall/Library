"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const JWT = require("jsonwebtoken");
const moment = require("moment");
const util_1 = require("util");
const BookBorrowing = require('./../Models/BorrowingModel');
const Book = require('./../Models/BookModel');
const CatchAsync = require('./../Utils/CatchAsync');
class BorrowingOperations {
}
_a = BorrowingOperations;
BorrowingOperations.borrowBook = CatchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const bookId = req.params.id;
    const token = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
    if (!token) {
        return res.status(401).json('You\'re not logged in, please go to login page');
    }
    const decoded = yield (0, util_1.promisify)(JWT.verify)(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const { dueDate } = req.body;
    const book = yield Book.findById(bookId);
    if (book.availableQuantity <= 0 || !book) {
        return res.status(400).json('Book Stock out, check it later!');
    }
    const operation = yield BookBorrowing.findOne({ book: bookId, borrower: userId, returned: false });
    if (operation) {
        return res.status(400).json('You\'re already borrowed that book!');
    }
    let borrowingResult;
    if (book.bookType == "free") {
        borrowingResult = new BookBorrowing({ borrower: userId, book: bookId, dueDate: dueDate });
        book.availableQuantity -= 1;
    }
    else if (book.bookType == "rental") {
        //calculate the rent
        const currentDate = moment();
        const dueDateObj = moment(dueDate, 'YYYY-MM-DD', true);
        const diffInDays = dueDateObj.diff(currentDate, 'days');
        const rentAmount = diffInDays * book.rentalFee;
        req.body.rentAmount = rentAmount;
        borrowingResult = new BookBorrowing({ borrower: userId, book: bookId, dueDate: dueDate, rentalFee: rentAmount });
    }
    yield borrowingResult.save();
    res.status(201).json({ data: borrowingResult });
}));
BorrowingOperations.returnBook = CatchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const bookId = req.params.id;
    const token = (_c = req.headers.authorization) === null || _c === void 0 ? void 0 : _c.split(' ')[1];
    if (!token) {
        return res.status(401).json('You\'re not logged in, please go to login page');
    }
    const decoded = yield (0, util_1.promisify)(JWT.verify)(token, process.env.JWT_SECRET);
    const operation = yield BookBorrowing.findOne({ book: bookId, borrower: decoded.id });
    const book = yield Book.findById(bookId);
    if (!operation || operation.returned) {
        return res.status(400).json({ message: "You didn't borrow this book or already returned :)" });
    }
    operation.returned = true;
    book.availableQuantity += 1;
    yield operation.save();
    yield book.save();
    res.status(200).json({ message: "The book is returned" });
}));
exports.default = BorrowingOperations;
