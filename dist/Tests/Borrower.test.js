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
const BorrowerController_1 = __importDefault(require("./../app/Controllers/BorrowerController"));
const util_1 = __importDefault(require("util"));
const UserModel_1 = require("./../app/Models/UserModel");
const BookModel_1 = __importDefault(require("./../app/Models/BookModel"));
const BorrowingModel_1 = __importDefault(require("./../app/Models/BorrowingModel"));
jest.mock('jsonwebtoken', () => ({
    __esModule: true,
    verify: jest.fn().mockResolvedValue({ id: 4 })
}));
jest.mock('util');
beforeEach(() => {
    jest.clearAllMocks();
});
let req;
let res;
describe('BorrowerController', () => {
    describe('show Borrower profile', () => {
        it('should show borrower profile within id', () => __awaiter(void 0, void 0, void 0, function* () {
            req = { params: { id: '4' } };
            res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
            const next = jest.fn();
            const mockBorrower = {
                id: 4,
                email: 'rawan@test.com'
            };
            jest.spyOn(UserModel_1.Borrower, 'findById').mockResolvedValue(mockBorrower);
            yield BorrowerController_1.default.getBorrowerProfile(req, res, next);
            yield expect(UserModel_1.Borrower.findById).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockBorrower);
        }));
        it("should show borrower profile within id", () => __awaiter(void 0, void 0, void 0, function* () {
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
            jest.spyOn(UserModel_1.Borrower, 'findById').mockResolvedValue(null);
            yield BorrowerController_1.default.getBorrowerProfile(req, res, next);
            yield expect(UserModel_1.Borrower.findById).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Borrower not found' });
        }));
    });
    describe("get all Borrowers", () => {
        it("should show borrowers ", () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            req = {
                query: {
                    searchTerm: "test",
                    sortField: "CreatedAt",
                    limit: '10'
                }
            };
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            const mockBorrowers = [
                { "_id": 2, "email": "rawan.gamaal21@gmail.com", "phoneNumber": "01022887277", "hiringDate": "2024-01-21T04:16:52.670Z", "salary": 3500, "firstName": "Rawan", "lastName": "Gamal", "image": "default.jpg", "role": "admin", "active": true, "createdAt": "2024-01-21T04:17:44.653Z", "updatedAt": "2024-01-31T04:20:34.707Z", "__v": 0, "phoneVerify": true },
                { "phoneVerify": false, "_id": 4, "email": "youmna.gamaal@gmail.com", "phoneNumber": "01022887100", "hiringDate": "2024-01-22T01:13:50.002Z", "salary": 4500, "firstName": "youmna", "lastName": "Gamal", "image": "default.jpg", "role": "manager", "active": true, "createdAt": "2024-01-22T01:13:55.912Z", "updatedAt": "2024-01-22T01:13:55.912Z", "__v": 0 }
            ];
            jest.spyOn(UserModel_1.Borrower, 'find').mockReturnValue({
                or: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockBorrowers)
            });
            yield BorrowerController_1.default.getAllBorrowers(req, res, next);
            expect(UserModel_1.Borrower.find).toHaveBeenCalledTimes(1);
            expect(UserModel_1.Borrower.find().limit).toHaveBeenCalledWith(parseInt((((_a = req.query) === null || _a === void 0 ? void 0 : _a.limit) || '5').toString()));
            expect(UserModel_1.Borrower.find().sort).toHaveBeenCalledWith((_b = req.query) === null || _b === void 0 ? void 0 : _b.sortField);
            expect(UserModel_1.Borrower.find().or).toHaveBeenCalledWith([{ "email": { "$options": "i", "$regex": (_c = req.query) === null || _c === void 0 ? void 0 : _c.searchTerm } },
                { "phoneNumber": { "$options": "i", "$regex": (_d = req.query) === null || _d === void 0 ? void 0 : _d.searchTerm } }]);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockBorrowers);
        }));
    });
    describe("update Borrower", () => {
        it("should update Borrower ", () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            req = {
                params: {
                    id: '4'
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
            jest.spyOn(UserModel_1.Borrower, "findByIdAndUpdate").mockResolvedValue((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
            yield BorrowerController_1.default.updateBorrower(req, res, next);
            expect(UserModel_1.Borrower.findByIdAndUpdate).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
        }));
    });
    describe("delete Borrower", () => {
        it("should delete Borrower since he returned all books ", () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
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
            jest.spyOn(UserModel_1.Borrower, 'findById').mockResolvedValue((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
            jest.spyOn(BorrowingModel_1.default, 'find').mockResolvedValue([]);
            jest.spyOn(UserModel_1.Borrower, 'findByIdAndDelete').mockResolvedValue((_b = req.params) === null || _b === void 0 ? void 0 : _b.id);
            yield BorrowerController_1.default.deleteBorrower(req, res, next);
            yield expect(UserModel_1.Borrower.findById).toHaveBeenCalledTimes(1);
            yield expect(BorrowingModel_1.default.find).toHaveBeenCalledTimes(1);
            yield expect(UserModel_1.Borrower.findByIdAndDelete).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
        }));
        it("shouldn\'t delete Borrower since he not returned all books yet", () => __awaiter(void 0, void 0, void 0, function* () {
            var _c;
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
            const operationsMock = [
                { _id: 1, book: "first" },
                { _id: 2, book: "second" }
            ];
            jest.spyOn(UserModel_1.Borrower, 'findById').mockResolvedValue((_c = req.params) === null || _c === void 0 ? void 0 : _c.id);
            jest.spyOn(BorrowingModel_1.default, 'find').mockResolvedValue(operationsMock);
            jest.spyOn(BookModel_1.default, 'find').mockResolvedValueOnce([{ book: "first" }, { book: "second" }]);
            yield BorrowerController_1.default.deleteBorrower(req, res, next);
            yield expect(UserModel_1.Borrower.findById).toHaveBeenCalledTimes(1);
            yield expect(BorrowingModel_1.default.find).toHaveBeenCalledTimes(1);
            yield expect(BookModel_1.default.find).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Borrower has books that haven't been returned",
                operationIds: [1, 2],
                borrowedBooks: [{ book: "first" }, { book: "second" }]
            });
        }));
    });
    describe('add Book to Wishlist', () => {
        it('should perform adding book to wishlist of specific borrower', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            req = {
                params: {
                    id: '973e7998uhklml'
                },
                headers: {
                    authorization: "Bearer token"
                }
            };
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            const BorrowerMock = {
                id: 4,
                wishList: ['9089893209', '908903uh3'], //book ids
                save: jest.fn().mockResolvedValue({})
            };
            jest.spyOn(util_1.default, 'promisify').mockImplementation((fn) => fn);
            jest.spyOn(BookModel_1.default, 'findById').mockResolvedValue((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
            jest.spyOn(UserModel_1.Borrower, 'findById').mockResolvedValue(BorrowerMock);
            yield BorrowerController_1.default.addWishBook(req, res, next);
            yield expect(util_1.default.promisify).toHaveBeenCalledTimes(1);
            yield expect(BookModel_1.default.findById).toHaveBeenCalledTimes(1);
            yield expect(UserModel_1.Borrower.findById).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
        }));
        it('shouldn\'t add same book to wishlist twice', () => __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            req = {
                params: {
                    id: '973e7998uhklml'
                },
                headers: {
                    authorization: "Bearer token"
                }
            };
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            const BorrowerMock = {
                id: 4,
                wishList: ['973e7998uhklml', '908903uh3'], //book ids
                save: jest.fn().mockResolvedValue({})
            };
            jest.spyOn(util_1.default, 'promisify').mockImplementation((fn) => fn);
            jest.spyOn(BookModel_1.default, 'findById').mockResolvedValue((_b = req.params) === null || _b === void 0 ? void 0 : _b.id);
            jest.spyOn(UserModel_1.Borrower, 'findById').mockResolvedValue(BorrowerMock);
            yield BorrowerController_1.default.addWishBook(req, res, next);
            yield expect(util_1.default.promisify).toHaveBeenCalledTimes(1);
            yield expect(BookModel_1.default.findById).toHaveBeenCalledTimes(1);
            yield expect(UserModel_1.Borrower.findById).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Book is already in ur wishlist' });
        }));
    });
});
