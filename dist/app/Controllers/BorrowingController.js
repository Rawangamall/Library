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
const moment_1 = __importDefault(require("moment"));
const stripe_1 = __importDefault(require("stripe"));
const QueryBuilder_1 = __importDefault(require("./QueryBuilder"));
const BookObservable_1 = __importDefault(require("./BookObservable"));
const BorrowingModel_1 = __importDefault(require("./../Models/BorrowingModel"));
const BookModel_1 = __importDefault(require("./../Models/BookModel"));
const CatchAsync_1 = __importDefault(require("../Utils/CatchAsync"));
const Stripe_SecretKey = process.env.Stripe_SecretKey;
const stripe = new stripe_1.default(Stripe_SecretKey);
class BorrowingOperations {
}
_a = BorrowingOperations;
BorrowingOperations.borrowBook = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const bookId = req.params.id;
    const token = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
    let session;
    if (!token) {
        return res.status(401).json('You\'re not logged in, please go to login page');
    }
    const decoded = yield (0, util_1.promisify)(JWT.verify)(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const { dueDate } = req.body;
    const book = yield BookModel_1.default.findById(bookId);
    if (book.availableQuantity <= 0 || !book) {
        return res.status(400).json('Book Stock out, check it later!');
    }
    const operation = yield BorrowingModel_1.default.findOne({ book: bookId, borrower: userId, returned: false });
    if (operation) {
        return res.status(400).json('You\'re already borrowed that book!');
    }
    let borrowingResult;
    if (book.bookType == "free") {
        borrowingResult = yield BorrowingModel_1.default.create({ borrower: userId, book: bookId, dueDate: dueDate });
    }
    else if (book.bookType == "rental") {
        //calculate the rent
        const currentDate = (0, moment_1.default)();
        const dueDateObj = (0, moment_1.default)(dueDate, 'YYYY-MM-DD', true);
        const diffInDays = dueDateObj.diff(currentDate, 'days');
        const rentAmount = diffInDays * book.rentalFee;
        session = yield stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `${book.title}`,
                            description: `the ${book.title} written by ${book.author}`,
                        },
                        unit_amount: rentAmount * 100, // in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'https://example.com/success',
            cancel_url: 'https://example.com/cancel',
            metadata: {
                userId: userId,
                bookId: bookId,
                dueDate: dueDate,
                Amount: rentAmount
            },
        });
    }
    res.status(201).json({ data: borrowingResult, sessionId: session === null || session === void 0 ? void 0 : session.id });
}));
BorrowingOperations.chargeForBorrow = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e, _f;
    const payload = req.rawBody;
    const sig = req.headers['stripe-signature'];
    // Verify webhook signature
    if (!sig) {
        return res.status(400).json({ error: 'Stripe signature missing in request headers' });
    }
    const event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = (_c = session.metadata) === null || _c === void 0 ? void 0 : _c.userId;
        const bookId = (_d = session.metadata) === null || _d === void 0 ? void 0 : _d.bookId;
        const rentAmount = parseInt((_e = session.metadata) === null || _e === void 0 ? void 0 : _e.Amount);
        const dueDate = (_f = session.metadata) === null || _f === void 0 ? void 0 : _f.dueDate;
        if (!userId || !bookId || !rentAmount) {
            return res.status(400).json({ error: 'Missing metadata in session object' });
        }
        const existingOperation = yield BorrowingModel_1.default.findOne({ sessionId: session.id });
        if (existingOperation) {
            return res.status(400).json({ message: 'This payment operation is already completed!' }); // duplicate event
        }
        const book = yield BookModel_1.default.findById(bookId);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        yield stripe.paymentIntents.create({
            amount: rentAmount * 100,
            currency: 'usd',
            description: `Rent for ${book.title}`,
        });
        yield BorrowingModel_1.default.create({ borrower: userId, book: bookId,
            rentalFee: rentAmount, dueDate: dueDate, sessionId: session.id });
        // Update book availability and sales count
        book.availableQuantity -= 1;
        book.sales += 1;
        yield book.save();
        res.status(200).json({ message: 'Payment processed successfully' });
    }
    res.status(400).json({ message: 'Event type not handled' });
}));
BorrowingOperations.returnBook = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    const bookId = req.params.id;
    const token = (_g = req.headers.authorization) === null || _g === void 0 ? void 0 : _g.split(' ')[1];
    if (!token) {
        return res.status(401).json('You\'re not logged in, please go to login page');
    }
    const decoded = yield (0, util_1.promisify)(JWT.verify)(token, process.env.JWT_SECRET);
    const operation = yield BorrowingModel_1.default.findOne({ book: bookId, borrower: decoded.id, returned: false });
    const book = yield BookModel_1.default.findById(bookId);
    if (!operation || operation.returned) {
        return res.status(400).json({ message: "You didn't borrow this book or already returned :)" });
    }
    operation.returned = true;
    book.availableQuantity += 1;
    yield operation.save();
    yield book.save();
    BookObservable_1.default.notifyObservers(bookId, true);
    res.status(200).json({ message: "The book is returned" });
}));
BorrowingOperations.OperationList = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = req.query.filter;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const sort = req.query.sort;
    const operationsQuery = new QueryBuilder_1.default(BorrowingModel_1.default)
        .limit(limit)
        .sort(sort)
        .filterReturned(filter)
        .populate('borrower', 'email')
        .populate('book');
    const operations = yield operationsQuery.build();
    if (operations.length === 0) {
        return res.status(404).json({ message: 'There\'s no operation' });
    }
    res.status(200).json(operations);
}));
exports.default = BorrowingOperations;
