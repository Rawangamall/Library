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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = require("./../Models/UserModel");
const UserClass_1 = __importDefault(require("./../Classes/UserClass"));
const QueryOperations_1 = __importDefault(require("./QueryOperations"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const CatchAsync_1 = __importDefault(require("./../Utils/CatchAsync"));
const saltRounds = 10;
const salt = bcrypt_1.default.genSaltSync(saltRounds);
class UserController {
}
_a = UserController;
UserController.createUser = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = yield bcrypt_1.default.hash(req.body.password, salt);
    const { firstName, lastName, phoneNumber, role, email, salary } = req.body;
    //user object from user class
    const newUser = new UserClass_1.default(firstName, lastName, phoneNumber, role, email, hash, parseFloat(salary));
    const user = new UserModel_1.User(newUser);
    const savedUser = yield user.save(newUser);
    res.status(201).json(savedUser);
}));
UserController.getUserProfile = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.id);
    const user = yield UserModel_1.User.findById(userId); //.select('-password -code -passwordResetExpires')   jest error
    if (!user) {
        return res.status(400).json({ error: "User not found" });
    }
    res.status(200).json(user);
}));
UserController.getAllUsers = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, limit } = req.query;
    const limitValue = typeof limit === 'string' ? parseInt(limit) : 7;
    const sortField = req.query.sortField || "createdAt";
    const queryOperations = new QueryOperations_1.default();
    let usersQuery = UserModel_1.User.find();
    if (searchTerm) {
        usersQuery = queryOperations.search(usersQuery, searchTerm, ['email', 'role', 'phoneNumber']);
    }
    const filteredUsersQuery = queryOperations.sort(queryOperations.limit(usersQuery, limitValue), sortField); //nested query
    const users = yield filteredUsersQuery.exec();
    if (users.length == 0) {
        return res.status(200).json({ message: "There's no user" });
    }
    res.status(200).json(users);
}));
UserController.UpdateUser = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.id);
    if (req.body.password) {
        const hash = yield bcrypt_1.default.hash(req.body.password, salt);
        req.body.password = hash;
    }
    ;
    if (req.body.salary)
        req.body.salary = parseFloat(req.body.salary);
    const user = yield UserModel_1.User.findByIdAndUpdate(userId, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        password: req.body.password,
        salary: req.body.salary,
    }, { new: true } // Return the updated document
    );
    if (!user) {
        return res.status(400).json({ error: "User not found" });
    }
    res.status(200).json(user);
}));
UserController.delUser = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.id);
    // *rember to check on the return of books
    const user = yield UserModel_1.User.findByIdAndDelete(userId);
    if (!user) {
        return res.status(400).json({ error: "There's no user" });
    }
    res.status(200).json(user);
}));
exports.default = UserController;
