"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const QueryOperations_1 = __importDefault(require("./../app/Controllers/QueryOperations"));
const mockQuery = {
    or: jest.fn(),
    sort: jest.fn(),
    limit: jest.fn(),
};
describe('QueryUtility methods', () => {
    let queryUtility;
    beforeEach(() => {
        queryUtility = new QueryOperations_1.default();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('search', () => {
        it('should call query.or with conditions when fields are provided', () => {
            const searchTerm = 'test';
            const fields = ['firstName', 'email'];
            //to be interepted as query type
            queryUtility.search(mockQuery, searchTerm, fields);
            expect(mockQuery.or).toHaveBeenCalledWith([
                { firstName: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } }
            ]);
        });
        it('should return the original query when no Fields are provided', () => {
            const searchTerm = 'test';
            const result = queryUtility.search(mockQuery, searchTerm);
            expect(mockQuery.or).not.toHaveBeenCalled();
            expect(result).toBe(mockQuery);
        });
    });
    describe('sort', () => {
        it('should call query.sort with sortCriteria', () => {
            const sortCriteria = 'createdAt';
            queryUtility.sort(mockQuery, sortCriteria);
            expect(mockQuery.sort).toHaveBeenCalledWith(sortCriteria);
        });
    });
    describe('limit', () => {
        it('should call query.limit with the limit num', () => {
            const limit = 10;
            queryUtility.limit(mockQuery, limit);
            expect(mockQuery.limit).toHaveBeenCalledWith(limit);
        });
    });
});
