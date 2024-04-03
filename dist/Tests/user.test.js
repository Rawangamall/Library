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
Object.defineProperty(exports, "__esModule", { value: true });
const UserController_1 = __importDefault(require("./../app/Controllers/UserController"));
const UserModel_1 = require("./../app/Models/UserModel");
const UserClass_1 = __importDefault(require("./../app/Classes/UserClass"));
const bcrypt = require('bcrypt');
jest.mock('bcrypt');
jest.mock('./../app/Classes/UserClass');
jest.mock('./../app/Models/UserModel');
beforeEach(() => {
    jest.clearAllMocks();
});
let req;
let res;
describe('UserController - createUser', () => {
    it('should create a new user', () => __awaiter(void 0, void 0, void 0, function* () {
        req = {
            body: {
                firstName: 'John',
                lastName: 'Wrick',
                phoneNumber: '12345189',
                role: 'employee',
                email: 'john.doe11@example.com',
                password: 'password1234!',
                salary: 4000,
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();
        jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
        const userClassInstanceMock = {
            firstName: 'John',
            lastName: 'Wrick',
            phoneNumber: '12345189',
            role: 'employee',
            email: 'john.doe11@example.com',
            password: 'hashedPassword',
            salary: 4000,
        };
        jest.spyOn(UserClass_1.default.prototype, 'constructor').mockReturnValue(userClassInstanceMock); //hateful never error
        jest.spyOn(UserModel_1.User.prototype, 'save').mockReturnValue(userClassInstanceMock);
        yield UserController_1.default.createUser(req, res, next);
        expect(UserClass_1.default.prototype.constructor).toHaveBeenCalledWith('John', 'Wrick', '12345189', 'employee', 'john.doe11@example.com', 'hashedPassword', 4000);
        expect(UserClass_1.default.prototype.constructor).toHaveReturnedWith(userClassInstanceMock);
        yield expect(UserModel_1.User.prototype.save).toHaveBeenCalledWith(userClassInstanceMock);
        expect(res.status).toHaveBeenCalledWith(201); //not called issue
    }));
});
describe('getUserProfile', () => {
    it('should get user data', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        req = {
            params: {
                _id: '6'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();
        UserModel_1.User.findById.mockResolvedValue((_a = req.params) === null || _a === void 0 ? void 0 : _a._id);
        yield UserController_1.default.getUserProfile(req, res, next);
        expect(res.status).toHaveBeenCalledWith(200);
    }));
    it('should handle user not found', () => __awaiter(void 0, void 0, void 0, function* () {
        req = {
            params: {
                _id: '4'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();
        UserModel_1.User.findById.mockResolvedValue(null);
        yield UserController_1.default.getUserProfile(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
    }));
});
describe('get all users', () => {
    it('should return all users when authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
        // const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzA2OTM0MTQ4LCJleHAiOjE3MDc1Mzg5NDh9.4KffiTPiYRnlp85MdZ4pZWUU3al_K6uEwTvgSBxCd24';
        var _a, _b, _c, _d, _e;
        const mockUsers = [
            { "_id": 2, "email": "rawan.gamaal21@gmail.com", "phoneNumber": "01022887277", "hiringDate": "2024-01-21T04:16:52.670Z", "salary": 3500, "firstName": "Rawan", "lastName": "Gamal", "image": "default.jpg", "role": "admin", "active": true, "createdAt": "2024-01-21T04:17:44.653Z", "updatedAt": "2024-01-31T04:20:34.707Z", "__v": 0, "phoneVerify": true },
            { "phoneVerify": false, "_id": 4, "email": "youmna.gamaal@gmail.com", "phoneNumber": "01022887100", "hiringDate": "2024-01-22T01:13:50.002Z", "salary": 4500, "firstName": "youmna", "lastName": "Gamal", "image": "default.jpg", "role": "manager", "active": true, "createdAt": "2024-01-22T01:13:55.912Z", "updatedAt": "2024-01-22T01:13:55.912Z", "__v": 0 }
        ];
        jest.spyOn(UserModel_1.User, 'find').mockReturnValue({
            or: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue(mockUsers)
        });
        req = {
            // headers: {
            //   authorization: `Bearer ${validToken}`,
            // },
            query: {
                searchTerm: 'rawan',
                limit: '4',
                sortField: 'createdAt',
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();
        yield UserController_1.default.getAllUsers(req, res, next);
        expect(UserModel_1.User.find).toHaveBeenCalledTimes(1);
        expect(UserModel_1.User.find().limit).toHaveBeenCalledWith(parseInt((((_a = req.query) === null || _a === void 0 ? void 0 : _a.limit) || '5').toString()));
        expect(UserModel_1.User.find().sort).toHaveBeenCalledWith((_b = req.query) === null || _b === void 0 ? void 0 : _b.sortField);
        expect(UserModel_1.User.find().or).toHaveBeenCalledWith([{ "email": { "$options": "i", "$regex": (_c = req.query) === null || _c === void 0 ? void 0 : _c.searchTerm } },
            { "role": { "$options": "i", "$regex": (_d = req.query) === null || _d === void 0 ? void 0 : _d.searchTerm } },
            { "phoneNumber": { "$options": "i", "$regex": (_e = req.query) === null || _e === void 0 ? void 0 : _e.searchTerm } }]);
        expect(res.status).toHaveBeenCalledWith(200);
    }));
});
describe("Delete use", () => {
    it("should del the user by his id", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        req = {
            params: {
                id: '4'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();
        UserModel_1.User.findByIdAndDelete.mockResolvedValue((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
        yield UserController_1.default.delUser(req, res, next);
        expect(res.status).toHaveBeenCalledWith(200);
    }));
    it("shouldn't del user without the id", () => __awaiter(void 0, void 0, void 0, function* () {
        req = {
            params: {
                id: '4'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();
        UserModel_1.User.findByIdAndDelete.mockResolvedValue(null);
        yield UserController_1.default.delUser(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
    }));
});
describe('Update user', () => {
    it("should update user", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        req = {
            params: {
                _id: '4'
            },
            body: {
                firstName: 'new name'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();
        jest.spyOn(UserModel_1.User, "findByIdAndUpdate").mockResolvedValue((_a = req.params) === null || _a === void 0 ? void 0 : _a._id);
        yield UserController_1.default.UpdateUser(req, res, next);
        expect(UserModel_1.User.findByIdAndUpdate).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
    }));
});
