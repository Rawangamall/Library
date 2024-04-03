"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const BookController_1 = __importDefault(require("./../Controllers/BookController"));
const Book_1 = require("./../Core/Validations/Book");
const Rate_1 = require("./../Core/Validations/Rate");
const validateMW_1 = __importDefault(require("./../Middlewares/validateMW"));
const auth = require("./../Middlewares/authenticationMW").auth;
const authorize = require("./../Middlewares/authorizationMW").authorize;
const rateLimitMW_1 = require("./../Middlewares/rateLimitMW");
router.route("/books")
    .post({ rateLimit: rateLimitMW_1.rateLimit }.rateLimit, upload.none(), Book_1.BookValidPOST, validateMW_1.default, BookController_1.default.createBook) //auth,authorize(['employee', 'manager']),
    .get({ rateLimit: rateLimitMW_1.rateLimit }.rateLimit, BookController_1.default.getAllBooks); //auth,authorize(['admin','employee', 'manager','borrower']),
router.route("/book/:id")
    .patch({ rateLimit: rateLimitMW_1.rateLimit }.rateLimit, upload.none(), Book_1.BookValidPATCH, validateMW_1.default, BookController_1.default.UpdateBook) //auth,authorize(['employee', 'manager']),
    .get({ rateLimit: rateLimitMW_1.rateLimit }.rateLimit, BookController_1.default.getBook) //auth,authorize(['admin','employee', 'manager','borrower']),
    .delete(BookController_1.default.delBook); //auth,authorize(['employee', 'manager']),
router.route("/books/bestseller")
    .get(BookController_1.default.BestsellerBooks);
router.route("/books/popularBooks")
    .get(BookController_1.default.popularBooks);
router.route("/rating/:id")
    .post({ rateLimit: rateLimitMW_1.rateLimit }.rateLimit, upload.none(), auth, authorize(['borrower']), Rate_1.RateValidPOST, validateMW_1.default, BookController_1.default.rateBook);
exports.default = router;
