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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const BookModel_1 = __importDefault(require("./../Models/BookModel"));
const BookClass_1 = require("./../Classes/BookClass");
const QueryOperations_1 = __importDefault(require("./QueryOperations"));
const CatchAsync_1 = __importDefault(require("./../Utils/CatchAsync"));
class BookController {
}
_a = BookController;
BookController.createBook = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let newBook;
    const { title, author, quantity, floor, section, shelf, type, fee } = req.body;
    const shelfLocation = `${floor}-${section.toUpperCase()}-${shelf}`;
    if (type === 'free') {
        newBook = new BookClass_1.BookClass(title, author, parseInt(quantity), shelfLocation);
    }
    else if (type === 'rental') {
        newBook = new BookClass_1.RentalBook(title, author, parseInt(quantity), shelfLocation, parseInt(fee));
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
    const sortField = req.query.sortField || "createdAt";
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
    res.status(200).json(books);
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
exports.default = BookController;
