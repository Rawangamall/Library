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
const bcrypt = require("bcrypt");
const { Borrower } = require('./../Models/UserModel');
const CatchAsync = require('./../Utils/CatchAsync');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
class BorrowerController {
}
_a = BorrowerController;
BorrowerController.getBorrowerProfile = CatchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const borrowerId = parseInt(req.params.id);
    const borrower = yield Borrower.findById(borrowerId);
    if (!borrower) {
        return res.status(400).json({ error: 'Borrower not found' });
    }
    res.status(200).json(borrower);
}));
BorrowerController.getAllBorrowers = CatchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const borrowers = yield Borrower.find();
    if (borrowers.length === 0) {
        return res.status(200).json({ message: "There's no borrower" });
    }
    res.status(200).json(borrowers);
}));
BorrowerController.updateBorrower = CatchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const borrowerId = parseInt(req.params.id);
    if (req.body.password) {
        const hash = yield bcrypt.hash(req.body.password, salt);
        req.body.password = hash;
    }
    const borrower = yield Borrower.findByIdAndUpdate(borrowerId, {
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
BorrowerController.deleteBorrower = CatchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const borrowerId = parseInt(req.params.id);
    const borrower = yield Borrower.findByIdAndDelete(borrowerId);
    if (!borrower) {
        return res.status(400).json({ error: "There's no borrower" });
    }
    res.status(200).json(borrower);
}));
exports.default = BorrowerController;
