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
exports.UserValidPATCH = exports.UserValidPOST = void 0;
const express_validator_1 = require("express-validator");
const UserModel_1 = require("./../../Models/UserModel");
const validRoles = ['admin', 'employee', 'manager'];
exports.UserValidPOST = [
    (0, express_validator_1.body)('firstName').isString().withMessage('Please enter your first name'),
    (0, express_validator_1.body)('lastName').isString().withMessage('Please enter your last name'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Enter a valid email')
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield UserModel_1.User.findOne({ email: value });
        if (user) {
            return Promise.reject('Email already in use');
        }
    })),
    (0, express_validator_1.body)('password').isStrongPassword().withMessage('enter strong password include numbers and signs - يجب أن تكون كلمة المرور قوية. يجب أن تحتوي على أحرف كبيرة وصغيرة وأرقام ورموز.'),
    (0, express_validator_1.body)('phoneNumber').isMobilePhone('ar-EG').withMessage('Please enter a valid Egyptian phone number')
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        if (value) {
            const user = yield UserModel_1.User.findOne({ phoneNumber: value });
            if (user) {
                return Promise.reject('Phone already in use - هذا الرقم مستخدم');
            }
        }
    })),
    (0, express_validator_1.body)('role').isIn(validRoles).withMessage('Invalid role. Choose from: admin, employee, manager'),
    (0, express_validator_1.body)('salary').isNumeric().withMessage('Please enter a valid salary in number')
];
exports.UserValidPATCH = [
    (0, express_validator_1.body)('firstName').isString().optional().withMessage('Please enter your name'),
    (0, express_validator_1.body)('lastName').isString().optional().withMessage('Please enter your name'),
    (0, express_validator_1.body)('email')
        .isEmail().optional().withMessage('enter valid email - يجب ادخال الايميل الصحيح')
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield UserModel_1.User.findOne({ email: value });
        if (user) {
            return Promise.reject('Email already in use - هذا الايميل مستخدم');
        }
    })),
    (0, express_validator_1.body)('password').isStrongPassword().optional().withMessage('enter strong password include numbers and signs - يجب أن تكون كلمة المرور قوية. يجب أن تحتوي على أحرف كبيرة وصغيرة وأرقام ورموز.'),
    (0, express_validator_1.body)('phoneNumber').isMobilePhone('ar-EG').withMessage('Please enter a valid Egyptian phone number').optional()
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        if (value) {
            const user = yield UserModel_1.User.findOne({ phoneNumber: value });
            if (user) {
                return Promise.reject('Phone already in use - هذا الرقم مستخدم');
            }
        }
    })),
    (0, express_validator_1.body)('salary').isNumeric().optional().withMessage('Please enter a valid salary in number'),
    (0, express_validator_1.body)('role').isIn(validRoles).optional().withMessage('Invalid role. Choose from: admin,  employee, manager'),
];
