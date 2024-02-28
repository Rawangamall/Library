import QueryUtility from './../app/Controllers/QueryOperations';
import { Document, FilterQuery, Query } from 'mongoose';

interface MockDocument extends Document {
    search(query: Query<MockDocument[], MockDocument>, searchTerm: string, fields?: string[]): Query<MockDocument[], MockDocument>;
    sort(query: Query<MockDocument[], MockDocument>, sortCriteria: string): Query<MockDocument[], MockDocument>;
    limit(query: Query<MockDocument[], MockDocument>, limit: number): Query<MockDocument[], MockDocument>;
  }
  

type QueryT<T> = Query<T[], T>;

const mockQuery: { [key: string]: jest.Mock } = {
  or: jest.fn(),
  sort: jest.fn(),
  limit: jest.fn(),
};

describe('QueryUtility methods', () => {
  let queryUtility: QueryUtility<MockDocument>;

  beforeEach(() => {
    queryUtility = new QueryUtility<MockDocument>();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('search', () => {
    it('should call query.or with conditions when fields are provided', () => {
      const searchTerm = 'test';
      const fields = ['firstName','email'];
                                     //to be interepted as query type
      queryUtility.search(mockQuery as unknown as QueryT<MockDocument>, searchTerm, fields);

      expect(mockQuery.or).toHaveBeenCalledWith([
        { firstName: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } }
      ]);
    });

    it('should return the original query when no Fields are provided', () => {
      const searchTerm = 'test';

      const result = queryUtility.search(mockQuery as unknown as QueryT<MockDocument>, searchTerm);

      expect(mockQuery.or).not.toHaveBeenCalled();
      expect(result).toBe(mockQuery);
    });
  });

  describe('sort', () => {
    it('should call query.sort with sortCriteria', () => {
      const sortCriteria = 'createdAt';

      queryUtility.sort(mockQuery as unknown as QueryT<MockDocument>, sortCriteria);

      expect(mockQuery.sort).toHaveBeenCalledWith(sortCriteria);
    });
  });

  describe('limit', () => {
    it('should call query.limit with the limit num', () => {
      const limit = 10;

      queryUtility.limit(mockQuery as unknown as QueryT<MockDocument>, limit);

      expect(mockQuery.limit).toHaveBeenCalledWith(limit);
    });
  });
});
