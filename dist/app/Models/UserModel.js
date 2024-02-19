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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Borrower = exports.User = void 0;
const { Schema, model, mongoose } = require('mongoose');
const AutoIncrement = require("mongoose-sequence")(mongoose);
const bcrypt = require("bcrypt");
const validateEmail = function (email) {
    const regex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    return regex.test(email);
};
const baseSchema = new Schema({
    _id: Number,
    firstName: String,
    lastName: String,
    password: { type: String, select: false },
    image: { type: String, default: "default.jpg" },
    role: { type: String, required: true, enum: ['admin', 'employee', 'manager', 'borrower'] },
    active: {
        type: Boolean,
        default: true,
    },
    phoneVerify: { type: Boolean, default: false }
}, { timestamps: true });
//check on password in 
baseSchema.methods.correctPassword = function (candidatePassword, userPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt.compare(candidatePassword, userPassword);
    });
};
baseSchema.plugin(AutoIncrement, { id: "user", inc_field: "_id" });
//mapping
//inheriting from the base schema
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        validate: [validateEmail, "invalid email"],
        unique: true, //separated from the base for the uniquness
    },
    phoneNumber: { type: String, unique: true },
    hiringDate: { type: Date, default: Date.now() },
    salary: { type: Number, default: 0.0 }
});
UserSchema.add(baseSchema);
const BorrowerSchema = new Schema({
    email: {
        type: String,
        required: true,
        validate: [validateEmail, "invalid email"],
        unique: true,
    },
    phoneNumber: { type: String, unique: true },
    wishList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
});
BorrowerSchema.add(baseSchema);
// list mongoose models
exports.User = model('User', UserSchema);
exports.Borrower = model('Borrower', BorrowerSchema);
