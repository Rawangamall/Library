"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorrowingValidGet = exports.BorrowingValidPOST = void 0;
const express_validator_1 = require("express-validator");
const moment_1 = __importDefault(require("moment"));
exports.BorrowingValidPOST = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid book id'),
    (0, express_validator_1.body)('dueDate').custom((value) => {
        const currentDate = (0, moment_1.default)();
        const dueDateObj = (0, moment_1.default)(value, 'YYYY-MM-DD', true);
        if (!dueDateObj.isValid() || dueDateObj.isBefore(currentDate)) {
            return Promise.reject('Due date must be a valid future date');
        }
        return true;
    }),
];
exports.BorrowingValidGet = [
    (0, express_validator_1.query)('filter').isBoolean().withMessage('choose the returned or non returned filter'),
];
