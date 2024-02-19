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
const bcrypt = __importStar(require("bcrypt"));
const UserModel_1 = require("./../Models/UserModel");
const BookModel_1 = __importDefault(require("./../Models/BookModel"));
const BorrowingModel_1 = __importDefault(require("./../Models/BorrowingModel"));
const CatchAsync_1 = __importDefault(require("./../Utils/CatchAsync"));
const QueryOperations_1 = __importDefault(require("./QueryOperations"));
const BookObservable_1 = __importDefault(require("./BookObservable"));
const util_1 = require("util");
const JWT = __importStar(require("jsonwebtoken"));
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
class BorrowerController {
}
_a = BorrowerController;
BorrowerController.getBorrowerProfile = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const borrowerId = parseInt(req.params.id);
    const borrower = yield UserModel_1.Borrower.findById(borrowerId);
    if (!borrower) {
        return res.status(400).json({ error: 'Borrower not found' });
    }
    res.status(200).json(borrower);
}));
BorrowerController.getAllBorrowers = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, sortField, limit } = req.query;
    let queryOperations = new QueryOperations_1.default();
    let borrowersQuery = UserModel_1.Borrower.find();
    if (searchTerm) {
        borrowersQuery = queryOperations.search(borrowersQuery, searchTerm, ['email', 'phoneNumber']);
    }
    const filteredUsersQuery = queryOperations.sort(queryOperations.limit(borrowersQuery, parseInt((limit || '5').toString())), sortField || 'createdAt'); //nested query
    const borrowers = yield filteredUsersQuery.exec();
    if (borrowers.length === 0) {
        return res.status(200).json({ message: "There's no borrower" });
    }
    res.status(200).json(borrowers);
}));
BorrowerController.updateBorrower = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const borrowerId = parseInt(req.params.id);
    if (req.body.password) {
        const hash = yield bcrypt.hash(req.body.password, salt);
        req.body.password = hash;
    }
    const borrower = yield UserModel_1.Borrower.findByIdAndUpdate(borrowerId, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        password: req.body.password,
    }, { new: true } // Return the updated document
    );
    if (!borrower) {
        return res.status(400).json({ error: 'Borrower not found' });
    }
    res.status(200).json(borrower);
}));
BorrowerController.deleteBorrower = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const borrowerId = parseInt(req.params.id);
    const borrowerUser = yield UserModel_1.Borrower.findById(borrowerId);
    if (!borrowerUser) {
        return res.status(404).json({ error: "borrower not found" });
    }
    const operations = yield BorrowingModel_1.default.find({ borrower: borrowerId, returned: false });
    //console.log(operations , operations.length)
    if (operations.length > 0) {
        const borrowedBooks = yield BookModel_1.default.find({ _id: { $in: operations.map((operation) => operation.book) } });
        return res.status(400).json({
            message: 'Borrower has books that haven\'t been returned',
            operationIds: operations.map((operation) => operation._id),
            borrowedBooks: borrowedBooks
        });
    }
    const borrower = yield UserModel_1.Borrower.findByIdAndDelete(borrowerId);
    res.status(200).json(borrower);
}));
BorrowerController.addWishBook = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const bookId = req.params.id;
    const token = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
    if (!token) {
        return res.status(401).json('You\'re not logged in, please go to login page');
    }
    const decoded = yield (0, util_1.promisify)(JWT.verify)(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const book = BookModel_1.default.findById(bookId);
    if (!book) {
        return res.status(400).json({ message: 'Book not found' });
    }
    const borrower = yield UserModel_1.Borrower.findById(userId);
    if (borrower.wishList.length > 0 && borrower.wishList.includes(bookId)) {
        return res.status(400).json({ message: 'Book is already in ur wishlist' });
    }
    borrower.wishList.push(bookId);
    yield borrower.save();
    BookObservable_1.default.registerObserver(bookId, borrower);
    res.status(200).json({ message: 'Book added to ur wishlist :)' });
}));
BorrowerController.removeWishBook = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const bookId = req.params.id;
    const token = (_c = req.headers.authorization) === null || _c === void 0 ? void 0 : _c.split(' ')[1];
    if (!token) {
        return res.status(401).json('You\'re not logged in, please go to login page');
    }
    const decoded = yield (0, util_1.promisify)(JWT.verify)(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const borrower = yield UserModel_1.Borrower.findById(userId);
    if (borrower.wishList.length == 0 || !(borrower.wishList.includes(bookId))) {
        return res.status(400).json({ message: 'Book isn\'t in ur wishlist' });
    }
    borrower.wishList = borrower.wishList.filter((book) => book !== bookId);
    yield borrower.save();
    BookObservable_1.default.removeObserver(bookId, borrower);
    res.status(200).json({ message: 'Book removed from ur wishlist :)' });
}));
exports.default = BorrowerController;
