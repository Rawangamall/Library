"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const JWT = __importStar(require("jsonwebtoken"));
const util_1 = require("util");
const BookModel_1 = __importDefault(require("./../Models/BookModel"));
const RatingModel_1 = __importDefault(require("./../Models/RatingModel"));
const BookClass_1 = require("./../Classes/BookClass");
const QueryOperations_1 = __importDefault(require("./QueryOperations"));
const CatchAsync_1 = __importDefault(require("./../Utils/CatchAsync"));
class BookController {
}
_a = BookController;
BookController.createBook = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let newBook;
    const { title, author, quantity, floor, section, shelf, type, fee, sales } = req.body;
    const shelfLocation = `${floor}-${section.toUpperCase()}-${shelf}`;
    if (type === 'free') {
        newBook = new BookClass_1.BookClass(title, author, parseInt(quantity), shelfLocation, sales);
    }
    else if (type === 'rental') {
        newBook = new BookClass_1.RentalBook(title, author, parseInt(quantity), shelfLocation, parseInt(fee), sales);
    }
    const book = new BookModel_1.default(newBook);
    yield book.save();
    res.status(201).json(newBook);
}));
BookController.getBook = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.id;
    const book = yield BookModel_1.default.findById(bookId);
    if (!book) {
        return res.status(400).json({ error: "book not found" });
    }
    res.status(200).json(book);
}));
BookController.getAllBooks = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, limit } = req.query;
    const limitValue = typeof limit === 'string' ? parseInt(limit) : 7;
    const sortField = req.query.sort || "createdAt";
    const queryOperations = new QueryOperations_1.default();
    let bookQuery = BookModel_1.default.find();
    if (searchTerm) {
        bookQuery = queryOperations.search(bookQuery, searchTerm, ['author', 'title', 'bookType', 'shelfLocation']);
    }
    const filteredBooksQuery = queryOperations.sort(queryOperations.limit(bookQuery, limitValue), sortField); //nested query
    const books = yield filteredBooksQuery.exec();
    if (books.length == 0) {
        return res.status(400).json({ error: "There's no book" });
    }
    res.status(200).json({ message: res.translate("book_list"), books });
}));
BookController.UpdateBook = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.id;
    const existbook = yield BookModel_1.default.findById(bookId);
    if (!existbook) {
        return res.status(400).json({ error: "book not found" });
    }
    if (req.body.quantity)
        req.body.quantity = parseInt(req.body.quantity);
    if (req.body.floor) {
        existbook.shelfLocation = `${req.body.floor}-${existbook.shelfLocation.split('-')[1]}-${existbook.shelfLocation.split('-')[2]}`;
    }
    if (req.body.section) {
        existbook.shelfLocation = `${existbook.shelfLocation.split('-')[0]}-${req.body.section}-${existbook.shelfLocation.split('-')[2]}`;
    }
    if (req.body.shelf) {
        existbook.shelfLocation = `${existbook.shelfLocation.split('-')[0]}-${existbook.shelfLocation.split('-')[1]}-${req.body.shelf}`;
    }
    const UniqueLocation = yield BookModel_1.default.findOne({ shelfLocation: existbook.shelfLocation, _id: { $ne: bookId } });
    if (UniqueLocation) {
        return res.status(400).json({ messsage: 'Shelf location already filled with another book' });
    }
    const book = yield BookModel_1.default.findByIdAndUpdate(bookId, {
        title: req.body.title,
        author: req.body.author,
        availableQuantity: req.body.quantity,
        shelfLocation: existbook.shelfLocation,
    }, { new: true });
    res.status(200).json(book);
}));
BookController.delBook = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.id;
    const book = yield BookModel_1.default.findByIdAndDelete(bookId);
    if (!book) {
        return res.status(400).json({ error: "There's no book" });
    }
    res.status(200).json(book);
}));
BookController.BestsellerBooks = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const limit = parseInt((_b = req.query) === null || _b === void 0 ? void 0 : _b.limit) || 10;
    const books = yield BookModel_1.default.find().sort("-sales").limit(limit);
    if (books.length == 0) {
        res.status(404).json({ message: "No books borrowed yet" });
    }
    res.status(200).json(books);
}));
BookController.popularBooks = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const limit = parseInt((_c = req.query) === null || _c === void 0 ? void 0 : _c.limit) || 10;
    const books = yield BookModel_1.default.find({ rating: { $in: [9, 10] } }).limit(limit); //.explain('executionStats')
    res.json({ message: res.translate("popular_list"), books });
}));
BookController.rateBook = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    const bookId = req.params.id;
    const value = parseInt((_d = req.body) === null || _d === void 0 ? void 0 : _d.value);
    const token = (_e = req.headers.authorization) === null || _e === void 0 ? void 0 : _e.split(' ')[1];
    if (!token) {
        return res.status(401).json('You\'re not logged in, please go to login page');
    }
    const decoded = yield (0, util_1.promisify)(JWT.verify)(token, process.env.JWT_SECRET);
    const book = yield BookModel_1.default.findById(bookId);
    if (!book) {
        res.status(404).json({ message: "Book not found to be rated" });
    }
    const existingRating = yield RatingModel_1.default.findOne({ user: decoded.id, book: bookId });
    // If the user already rated the book, update the existing rating
    if (existingRating) {
        existingRating.ratingValue = value;
        yield existingRating.save();
    }
    else {
        const rating = new RatingModel_1.default({
            user: decoded.id,
            book: bookId,
            ratingValue: value
        });
        yield rating.save();
    }
    //new average rating for the book
    const ratings = yield RatingModel_1.default.find({ book: bookId });
    const sumRatings = ratings.reduce((sum, rating) => sum + rating.ratingValue, 0);
    const averageRating = ratings.length === 0 ? 0 : sumRatings / ratings.length;
    book.rating = averageRating;
    yield book.save();
    res.status(200).json({ message: 'Rating success' });
}));
exports.default = BookController;
