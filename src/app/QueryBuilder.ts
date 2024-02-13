import { Model, Document, FilterQuery, Query } from 'mongoose';

class QueryBuilder<T extends Document> {
  private model: Model<T>;
  private query: Query<T[], T>;
  private sortOptions: string = '';
  private limitValue: number =10;
  private returnedFilter: boolean | null = null;

  constructor(model: Model<T>) {
    this.model = model;
    this.query = this.model.find();
  }

  find(query: any): this {
    this.query = query;
    return this;
  }

  filterReturned(returned: boolean): this {
    if(returned){
    this.returnedFilter = returned;
    }
    return this;
  }
  sort(sortOptions: string): this {
    this.sortOptions = sortOptions;
    return this;
  }

  limit(limit: number): this {
    this.limitValue = limit;
    return this;
  }



  async build(): Promise<T[]> {
    let mongooseQuery = this.model.find(this.query);
    if (this.returnedFilter !== null) {
      mongooseQuery = mongooseQuery.where('returned').equals(this.returnedFilter);
    }

    if (Object.keys(this.sortOptions).length > 0) {
      mongooseQuery = mongooseQuery.sort(this.sortOptions);
    }

    if (this.limitValue !== null) {
      mongooseQuery = mongooseQuery.limit(this.limitValue);
    }


    return mongooseQuery;
  }
}

export default QueryBuilder