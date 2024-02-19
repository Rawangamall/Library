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
exports.borrowerAuth = exports.userAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const util_1 = require("util");
const UserModel_1 = require("./../Models/UserModel");
const BorrowerClass_1 = __importDefault(require("./../Classes/BorrowerClass"));
const CatchAsync_1 = __importDefault(require("./../Utils/CatchAsync"));
const appError_1 = __importDefault(require("./../Utils/appError"));
const SMS_service_1 = require("./../Utils/SMS_service");
const CatchAsync_2 = __importDefault(require("./../Utils/CatchAsync"));
const saltRounds = 10;
const salt = bcrypt_1.default.genSaltSync(saltRounds);
class AuthBase {
    constructor(model) {
        this.login = (0, CatchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            if (!email || !password) {
                return next(new appError_1.default(` Missing paramters for login`, 404));
            }
            const user = yield this.model.findOne({ email: email }).select("+password");
            if (!user || !(yield user.correctPassword(password, user.password))) {
                return next(new appError_1.default(`Incorrect email or password`, 401));
            }
            if (user.active == false) {
                return next(new appError_1.default(`You're not allowed to login!, U're not active now`, 401));
            }
            const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN });
            res.status(200).json({
                status: "success",
                token
            });
        }));
        this.forgetpassword = (0, CatchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.model.findOne({ email: req.body.email });
            if (!user) {
                return next(new appError_1.default(`User of that email not found`, 401));
            }
            const isSMSSent = yield (0, SMS_service_1.sendSMS)(user.phoneNumber);
            if (isSMSSent) {
                return res.status(200).json({ message: "Success: SMS sent for password reset" });
            }
            else {
                return next(new appError_1.default("Error sending SMS. Please try again later!", 400));
            }
        }));
        this.resetpassword = (0, CatchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const otp = req.body.code;
            const newPassword = req.body.password;
            const phone = req.body.phone;
            const user = yield this.model.findOne({ phoneNumber: phone });
            if (!user) {
                return next(new appError_1.default(`User with that phone number not found`, 401));
            }
            const verify = yield (0, SMS_service_1.verifyUser)(phone, otp);
            if (!verify) {
                return next(new appError_1.default("invalid otp code", 400));
            }
            if (!newPassword || (req.body.confirmPassword) != newPassword) {
                return next(new appError_1.default("Enter valid password and its match", 400));
            }
            else {
                user.password = bcrypt_1.default.hashSync(newPassword, salt);
                yield user.save();
            }
            res.status(200).json({ message: "success" });
        }));
        this.SendVerifactionCode = (0, CatchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            if (!token) {
                return next(new appError_1.default('You\'re not logged in, please go to login page', 401));
            }
            const decoded = yield (0, util_1.promisify)(jsonwebtoken_1.default.verify)(token, process.env.JWT_SECRET);
            //verify if the user of that token still exist
            const user = yield this.model.findById(decoded.id);
            if (!user) {
                return next(new appError_1.default("The user of that token no longer exist", 401));
            }
            const isSMSSent = yield (0, SMS_service_1.sendSMS)(user.phoneNumber);
            if (!isSMSSent) {
                return next(new appError_1.default("Error sending SMS. Please try again later!", 500));
            }
            return res.status(200).json({ message: "Success: SMS sent for Verifaction" });
        }));
        this.phoneVerify = (0, CatchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            const otp = req.body.code;
            const token = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
            if (!token) {
                return next(new appError_1.default('You\'re not logged in, please go to login page', 401));
            }
            const decoded = yield (0, util_1.promisify)(jsonwebtoken_1.default.verify)(token, process.env.JWT_SECRET);
            //verify if the user of that token still exist
            const user = yield this.model.findById(decoded.id);
            if (!user) {
                return next(new appError_1.default("The user of that token no longer exist", 401));
            }
            const verify = yield (0, SMS_service_1.verifyUser)(user.phoneNumber, otp);
            if (!verify) {
                res.status(400).json({ message: "invalid otp code" });
            }
            user.phoneVerify = true;
            yield user.save();
            res.status(200).json({ message: "Success: Ur Phone Verified" });
        }));
        this.isValidToken = (0, CatchAsync_2.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _c;
            const token = (_c = req.headers) === null || _c === void 0 ? void 0 : _c.authorization;
            const decoded = yield (0, util_1.promisify)(jsonwebtoken_1.default.verify)(token, process.env.JWT_SECRET);
            //console.log(decoded)
            const expirationDate = new Date(decoded.exp * 1000);
            const currentDate = new Date();
            if (currentDate > expirationDate) {
                return res.status(401).json({ message: 'Token expired' });
            }
            return res.status(200).json({ message: 'Token is valid' });
        }));
        this.model = model;
    }
}
class BorrowerAuth extends AuthBase {
    constructor() {
        super(UserModel_1.Borrower); // Override the model
        this.Register = (0, CatchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const hash = yield bcrypt_1.default.hash(req.body.password, salt);
            const { firstName, lastName, phoneNumber, role, email, wishlist } = req.body;
            const newBorrower = new BorrowerClass_1.default(firstName, lastName, phoneNumber, role, email, hash, wishlist);
            // console.log(typeof(newBorrower),newBorrower)
            const borrower = new UserModel_1.Borrower(newBorrower);
            yield borrower.save();
            res.status(201).json(newBorrower);
        }));
    }
}
class UserAuth extends AuthBase {
    constructor() {
        super(UserModel_1.User);
    }
}
const userAuth = new UserAuth();
exports.userAuth = userAuth;
const borrowerAuth = new BorrowerAuth();
exports.borrowerAuth = borrowerAuth;
