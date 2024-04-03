"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateValidPOST = void 0;
const express_validator_1 = require("express-validator");
exports.RateValidPOST = [
    (0, express_validator_1.body)('value').isNumeric().withMessage("please enter valid numeric rate"),
    (0, express_validator_1.param)('id').isMongoId().withMessage("please choose available existed book")
];
