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
exports.borrowerPHVerifyMW = exports.userPHVerifyMW = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const util_1 = require("util");
const UserModel_1 = require("./../Models/UserModel");
const CatchAsync_1 = __importDefault(require("./../Utils/CatchAsync"));
const appError_1 = __importDefault(require("./../Utils/appError"));
class VerifyBase {
    constructor(model) {
        this.Verify = (0, CatchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            if (!token) {
                return next(new appError_1.default('You\'re not logged in, please go to login page', 401));
            }
            const decoded = yield (0, util_1.promisify)(jsonwebtoken_1.default.verify)(token, process.env.JWT_SECRET);
            const user = yield this.model.findById(decoded.id);
            if (!user || !user.phoneVerify) {
                return next(new appError_1.default('You\'re not verified your number, please go to verify it first', 401));
            }
            next();
        }));
        this.model = model;
    }
}
const userPHVerifyMW = new VerifyBase(UserModel_1.User);
exports.userPHVerifyMW = userPHVerifyMW;
const borrowerPHVerifyMW = new VerifyBase(UserModel_1.Borrower);
exports.borrowerPHVerifyMW = borrowerPHVerifyMW;
