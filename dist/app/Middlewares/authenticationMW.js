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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserModel_1 = require("./../Models/UserModel");
const UserModel_2 = require("./../Models/UserModel");
const appError_1 = __importDefault(require("./../Utils/appError"));
const CatchAsync_1 = __importDefault(require("./../Utils/CatchAsync"));
const util_1 = require("util");
exports.auth = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new appError_1.default('You\'re not logged in, please go to login page', 401));
    }
    const decoded = yield (0, util_1.promisify)(jsonwebtoken_1.default.verify)(token, process.env.JWT_SECRET);
    if (decoded.exp <= Date.now() / 1000) {
        return next(new appError_1.default('Your token has expired. Please log in again.', 401));
    }
    //verify if the user of that token still exist
    const user = yield UserModel_1.User.findById(decoded.id);
    const borrower = yield UserModel_2.Borrower.findById(decoded.id);
    if (!user && !borrower) {
        return next(new appError_1.default("The user of that token no longer exist", 401));
    }
    next();
}));
