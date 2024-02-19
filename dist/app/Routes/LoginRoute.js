"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const LoginController_1 = require("./../Controllers/LoginController");
const Borrower_1 = require("./../Core/Validations/Borrower");
const validateMW_1 = __importDefault(require("./../Middlewares/validateMW"));
const auth = require("./../Middlewares/authenticationMW").auth;
router.route("/register") //for borrowers only - user added by admin
    .post(upload.none(), Borrower_1.BorrowerValidPOST, validateMW_1.default, LoginController_1.borrowerAuth.Register);
router.route("/login") //for borrowers 
    .post(upload.none(), LoginController_1.borrowerAuth.login);
router.route("/forgetpassword") //for borrowers
    .post(upload.none(), LoginController_1.borrowerAuth.forgetpassword);
router.route("/resetpassword") //for borrowers 
    .patch(upload.none(), LoginController_1.borrowerAuth.resetpassword);
router.route("/dashboard/login") //for dashboard users 
    .post(upload.none(), LoginController_1.userAuth.login);
router.route("/dashboard/forgetpassword") //for dashboard users 
    .post(upload.none(), LoginController_1.userAuth.forgetpassword);
router.route("/dashboard/resetpassword") //for dashboard users 
    .patch(upload.none(), LoginController_1.userAuth.resetpassword);
router.route("/user/PhoneVerify")
    .get(auth, LoginController_1.userAuth.SendVerifactionCode)
    .patch(auth, upload.none(), LoginController_1.userAuth.phoneVerify);
router.route("/borrower/PhoneVerify")
    .get(auth, LoginController_1.borrowerAuth.SendVerifactionCode)
    .patch(auth, upload.none(), LoginController_1.borrowerAuth.phoneVerify);
exports.default = router;
