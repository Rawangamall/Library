import { Model, Document , Query } from 'mongoose';

class QueryBuilder<T extends Document> {
  private model: Model<T>;
  private query: Query<T[], T>;

  constructor(model: Model<T>) {
    this.model = model;
    this.query = this.model.find();
  }

  find(query: any): this {
    this.query = this.model.find(query);
    return this;
  }

  filterReturned(returned: boolean): this {
    if (returned) {
      this.query = this.query.where('returned').equals(returned);
    }
    return this;
  }

  sort(sortOptions: string): this {
    this.query = this.query.sort(sortOptions);
    return this;
  }

  limit(limit: number): this {
    this.query = this.query.limit(limit);
    return this;
  }

  populate(path: string, select?: string): this {
    this.query = this.query.populate(path, select);
    return this;
  }

  async build(): Promise<T[]> {
    return await this.query.exec();
  }
}

export default QueryBuilder;
