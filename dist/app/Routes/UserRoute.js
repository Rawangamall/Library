"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const UserController_1 = __importDefault(require("./../Controllers/UserController"));
const User_1 = require("./../Core/Validations/User");
const validateMW_1 = __importDefault(require("./../Middlewares/validateMW"));
const auth = require("./../Middlewares/authenticationMW").auth;
const authorizationMW_1 = require("./../Middlewares/authorizationMW");
const rateLimitMW_1 = require("./../Middlewares/rateLimitMW");
router.route("/users")
    .post({ rateLimit: rateLimitMW_1.rateLimit }.rateLimit, upload.none(), User_1.UserValidPOST, validateMW_1.default, UserController_1.default.createUser) //auth,authorize(['admin', 'manager']),
    .get(auth, (0, authorizationMW_1.authorize)(['admin', 'manager']), { rateLimit: rateLimitMW_1.rateLimit }.rateLimit, UserController_1.default.getAllUsers); //{userPHVerifyMW},
router.route("/user/:id")
    .get({ rateLimit: rateLimitMW_1.rateLimit }.rateLimit, UserController_1.default.getUserProfile) //auth,authorize(['admin','employee', 'manager']),
    .patch({ rateLimit: rateLimitMW_1.rateLimit }.rateLimit, upload.none(), User_1.UserValidPATCH, UserController_1.default.UpdateUser) //auth,authorize(['admin','employee', 'manager']),
    .delete({ rateLimit: rateLimitMW_1.rateLimit }.rateLimit, UserController_1.default.delUser); //auth,authorize(['admin']),
exports.default = router;
