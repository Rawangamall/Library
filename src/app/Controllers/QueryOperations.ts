import { Document, FilterQuery, Query } from 'mongoose';

interface QueryOperations<T extends Document> {
  search(query: Query<T[], T>, searchTerm: string , Fields?: string[]): Query<T[], T>;
  sort(query: Query<T[], T>, sortCriteria: string): Query<T[], T>;
  limit(query: Query<T[], T>, limit: number): Query<T[], T>;
}

abstract class AbstractQueryUtility<T extends Document> implements QueryOperations<T> {

  search(query: Query<T[], T>, searchTerm: string, Fields?: string[]): Query<T[], T> {
    if (Fields && Fields.length > 0) {
      const orConditions = Fields.map((field) => ({ [field]: { $regex: searchTerm, $options: 'i' } })) as FilterQuery<T>[];
      return query.or(orConditions);
    }
  
    return query;
  }
  

  abstract sort(query: Query<T[], T>, sortCriteria: string): Query<T[], T>;
  abstract limit(query: Query<T[], T>, limit: number): Query<T[], T>;
}

class QueryUtility<T extends Document> extends AbstractQueryUtility<T> {

  sort(query: Query<T[], T>, sortCriteria: string): Query<T[], T> {
    return query.sort(sortCriteria);
  }

  limit(query: Query<T[], T>, limit: number): Query<T[], T> {
    return query.limit(limit);
  }
}

export default QueryUtility;
