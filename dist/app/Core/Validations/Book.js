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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookValidPATCH = exports.BookValidPOST = void 0;
const express_validator_1 = require("express-validator");
const BookModel_1 = __importDefault(require("./../../Models/BookModel"));
const bookTypes = ['free', 'rental'];
exports.BookValidPOST = [
    (0, express_validator_1.body)('title').isString().withMessage('Please enter the book name'),
    (0, express_validator_1.body)('author').isString().withMessage('Please enter the author name'),
    (0, express_validator_1.body)('quantity').isInt().withMessage('Please enter the quantity number'),
    (0, express_validator_1.body)('type').isIn(bookTypes).withMessage('Invalid book types. Choose from: free and rental')
        .custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        if (value === 'rental') {
            if (!parseInt(req.body.fee)) {
                throw new Error('Enter a valid number for book fees');
            }
        }
    })),
    (0, express_validator_1.body)('floor').isString().withMessage('Please enter the floor number'),
    (0, express_validator_1.body)('section').isString().withMessage('Please enter the section'),
    (0, express_validator_1.body)('shelf').isString().withMessage('Please enter the shelf number')
        .custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        const { floor, section, shelf } = req.body;
        const shelfLocation = `${floor}-${section}-${shelf}`;
        const existingBook = yield BookModel_1.default.findOne({ shelfLocation: shelfLocation });
        if (existingBook) {
            throw new Error('Shelf location already filled with another book');
        }
        return true;
    })),
];
exports.BookValidPATCH = [
    (0, express_validator_1.body)('title').isString().optional().withMessage('Please enter the book name'),
    (0, express_validator_1.body)('author').isString().optional().withMessage('Please enter the author name'),
    (0, express_validator_1.body)('quantity').isInt().optional().withMessage('Please enter the quantity number'),
    (0, express_validator_1.body)('floor').isString().optional().withMessage('Please enter the floor number'),
    (0, express_validator_1.body)('section').isString().optional().withMessage('Please enter the section'),
    (0, express_validator_1.body)('shelf').isString().optional().withMessage('Please enter the shelf number')
];
