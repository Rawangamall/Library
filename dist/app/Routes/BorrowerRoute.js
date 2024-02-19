"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const BorrowerController_1 = __importDefault(require("./../Controllers/BorrowerController"));
const Borrower_1 = require("./../Core/Validations/Borrower");
const validateMW_1 = __importDefault(require("./../Middlewares/validateMW"));
const auth = require("./../Middlewares/authenticationMW").auth;
const authorize = require("./../Middlewares/authorizationMW").authorize;
const rateLimitMW_1 = require("./../Middlewares/rateLimitMW");
router.route("/borrowers")
    .get({ rateLimit: rateLimitMW_1.rateLimit }.rateLimit, auth, authorize(['admin', 'manager']), BorrowerController_1.default.getAllBorrowers);
router.route("/borrower/:id")
    .get({ rateLimit: rateLimitMW_1.rateLimit }.rateLimit, auth, authorize(['admin', 'employee', 'manager', 'borrower']), BorrowerController_1.default.getBorrowerProfile)
    .patch({ rateLimit: rateLimitMW_1.rateLimit }.rateLimit, upload.none(), auth, authorize(['borrower']), Borrower_1.BorrowerValidPATCH, validateMW_1.default, BorrowerController_1.default.updateBorrower)
    .delete({ rateLimit: rateLimitMW_1.rateLimit }.rateLimit, auth, authorize(['admin']), BorrowerController_1.default.deleteBorrower)
    .post({ rateLimit: rateLimitMW_1.rateLimit }.rateLimit, upload.none(), auth, authorize(['borrower']), BorrowerController_1.default.addWishBook); //id param = bookid
exports.default = router;
