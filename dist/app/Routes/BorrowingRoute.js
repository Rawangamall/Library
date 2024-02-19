"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const BorrowingController_1 = __importDefault(require("../Controllers/BorrowingController"));
const Operation_1 = require("../Core/Validations/Operation");
const validateMW_1 = __importDefault(require("../Middlewares/validateMW"));
const auth = require("../Middlewares/authenticationMW").auth;
const authorize = require("../Middlewares/authorizationMW").authorize;
const rateLimitMW_1 = require("../Middlewares/rateLimitMW");
const PhoneVerifactionMW_1 = require("./../Middlewares/PhoneVerifactionMW");
router.route("/operation/:id") //bookID
    .post({ rateLimit: rateLimitMW_1.rateLimit }.rateLimit, auth, authorize(['borrower']), upload.none(), PhoneVerifactionMW_1.borrowerPHVerifyMW.Verify, Operation_1.BorrowingValidPOST, validateMW_1.default, BorrowingController_1.default.borrowBook) //auth,authorize(['borrower']),
    .get(auth, authorize(['admin', 'manager']), { rateLimit: rateLimitMW_1.rateLimit }.rateLimit)
    .patch(auth, authorize(['borrower']), { rateLimit: rateLimitMW_1.rateLimit }.rateLimit, BorrowingController_1.default.returnBook);
router.route("/operations")
    .get(auth, authorize(['admin', 'manager']), Operation_1.BorrowingValidGet, validateMW_1.default, BorrowingController_1.default.OperationList);
exports.default = router;
