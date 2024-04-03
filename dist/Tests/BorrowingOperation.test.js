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
const BorrowingController_1 = __importDefault(require("../app/Controllers/BorrowingController"));
const BorrowingModel_1 = __importDefault(require("../app/Models/BorrowingModel"));
const BookModel_1 = __importDefault(require("../app/Models/BookModel"));
const util_1 = __importDefault(require("util"));
jest.mock('../app/Models/BorrowingModel');
jest.mock('../app/Models/BookModel');
jest.mock('./../app/Controllers/BookObservable');
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
describe('Borrowing operation controller', () => {
    describe('Borrowing Book', () => {
        it('should perform Borrowing operation for specific user and book', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            req = {
                params: {
                    id: '973e7998uhklml'
                },
                headers: {
                    authorization: "Bearer token"
                },
                body: {
                    dueDate: '2024-2-7'
                }
            };
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            const bookMock = {
                availableQuantity: 4,
                bookType: 'free',
                save: jest.fn().mockResolvedValue({})
            };
            const borrowingMock = {
                borrower: 'userid',
                book: (_a = req.params) === null || _a === void 0 ? void 0 : _a.id,
                dueDate: '2024-02-06T22:00:00.000Z',
                returned: false,
                rentalFee: 0,
                _id: "65c48ca940ae072065d19f98",
                save: jest.fn().mockResolvedValue({})
            };
            jest.spyOn(BorrowingModel_1.default, 'create').mockReturnValue(borrowingMock);
            jest.spyOn(util_1.default, 'promisify').mockImplementation((fn) => fn);
            jest.spyOn(BookModel_1.default, 'findById').mockResolvedValue(bookMock);
            jest.spyOn(BorrowingModel_1.default, 'findOne').mockResolvedValue(null);
            yield BorrowingController_1.default.borrowBook(req, res, next);
            yield expect(util_1.default.promisify).toHaveBeenCalledTimes(1);
            yield expect(BookModel_1.default.findById).toHaveBeenCalledWith((_b = req.params) === null || _b === void 0 ? void 0 : _b.id);
            yield expect(BorrowingModel_1.default.create).toHaveBeenCalledTimes(1);
            yield expect(borrowingMock.save).toHaveBeenCalledTimes(1);
            expect(bookMock.availableQuantity).toBe(3); //decres by 1
            yield expect(bookMock.save).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(201);
        }));
        it('should\'t perform borrow on outstock book ', () => __awaiter(void 0, void 0, void 0, function* () {
            var _c;
            req = {
                params: {
                    id: '973e7998uhklml'
                },
                headers: {
                    authorization: "Bearer token"
                },
                body: {
                    dueDate: '2024-2-7'
                }
            };
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            const bookMock = {
                availableQuantity: 0,
                bookType: 'free',
                save: jest.fn().mockResolvedValue({})
            };
            jest.spyOn(util_1.default, 'promisify').mockImplementation((fn) => fn);
            jest.spyOn(BookModel_1.default, 'findById').mockResolvedValue(bookMock);
            yield BorrowingController_1.default.borrowBook(req, res, next);
            yield expect(util_1.default.promisify).toHaveBeenCalledTimes(1);
            yield expect(BookModel_1.default.findById).toHaveBeenCalledWith((_c = req.params) === null || _c === void 0 ? void 0 : _c.id);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith('Book Stock out, check it later!');
        }));
        it('shouldn\'t perform Borrowing operation twice if not returned yet', () => __awaiter(void 0, void 0, void 0, function* () {
            var _d;
            req = {
                params: {
                    id: '973e7998uhklml'
                },
                headers: {
                    authorization: "Bearer token"
                },
                body: {
                    dueDate: '2024-2-7'
                }
            };
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            const bookMock = {
                availableQuantity: 4,
                bookType: 'free',
                save: jest.fn().mockResolvedValue({})
            };
            jest.spyOn(util_1.default, 'promisify').mockImplementation((fn) => fn);
            jest.spyOn(BookModel_1.default, 'findById').mockResolvedValue(bookMock);
            jest.spyOn(BorrowingModel_1.default, 'findOne').mockResolvedValue({ operation: "there's one" });
            yield BorrowingController_1.default.borrowBook(req, res, next);
            yield expect(util_1.default.promisify).toHaveBeenCalledTimes(1);
            yield expect(BookModel_1.default.findById).toHaveBeenCalledWith((_d = req.params) === null || _d === void 0 ? void 0 : _d.id);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith('You\'re already borrowed that book!');
        }));
    });
    describe('Retrurn Book', () => {
        it('should return a book', () => __awaiter(void 0, void 0, void 0, function* () {
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
            const bookMock = {
                availableQuantity: 4,
                bookType: 'free',
                save: jest.fn().mockResolvedValue({})
            };
            const operationMock = {
                id: "test",
                returned: false,
                save: jest.fn().mockResolvedValue({})
            };
            jest.spyOn(util_1.default, 'promisify').mockImplementation((fn) => fn);
            jest.spyOn(BorrowingModel_1.default, 'findOne').mockResolvedValue(operationMock);
            jest.spyOn(BookModel_1.default, 'findById').mockResolvedValue(bookMock);
            yield BorrowingController_1.default.returnBook(req, res, next);
            yield expect(util_1.default.promisify).toHaveBeenCalledTimes(1);
            yield expect(BorrowingModel_1.default.findOne).toHaveBeenCalledTimes(1);
            yield expect(BookModel_1.default.findById).toHaveBeenCalledWith((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
            yield expect(operationMock.save).toHaveBeenCalledTimes(1);
            yield expect(bookMock.save).toHaveBeenCalledTimes(1);
            expect(operationMock.returned).toBe(true);
            expect(bookMock.availableQuantity).toBe(5); //inc by 1
            expect(res.status).toHaveBeenCalledWith(200);
        }));
        it('shouldn\'t return a book twice', () => __awaiter(void 0, void 0, void 0, function* () {
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
            const bookMock = {
                availableQuantity: 4,
                bookType: 'free',
                save: jest.fn().mockResolvedValue({})
            };
            const operationMock = {
                id: "test",
                returned: true,
                save: jest.fn().mockResolvedValue({})
            };
            jest.spyOn(util_1.default, 'promisify').mockImplementation((fn) => fn);
            jest.spyOn(BorrowingModel_1.default, 'findOne').mockResolvedValue(operationMock);
            jest.spyOn(BookModel_1.default, 'findById').mockResolvedValue(bookMock);
            yield BorrowingController_1.default.returnBook(req, res, next);
            yield expect(util_1.default.promisify).toHaveBeenCalledTimes(1);
            yield expect(BorrowingModel_1.default.findOne).toHaveBeenCalledTimes(1);
            yield expect(BookModel_1.default.findById).toHaveBeenCalledWith((_b = req.params) === null || _b === void 0 ? void 0 : _b.id);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "You didn't borrow this book or already returned :)" });
        }));
    });
});
