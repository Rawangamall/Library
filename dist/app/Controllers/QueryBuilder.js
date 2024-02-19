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
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder {
    constructor(model) {
        this.sortOptions = '';
        this.limitValue = 10;
        this.returnedFilter = null;
        this.model = model;
        this.query = this.model.find();
    }
    find(query) {
        this.query = query;
        return this;
    }
    filterReturned(returned) {
        if (returned) {
            this.returnedFilter = returned;
        }
        return this;
    }
    sort(sortOptions) {
        this.sortOptions = sortOptions;
        return this;
    }
    limit(limit) {
        this.limitValue = limit;
        return this;
    }
    build() {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
}
exports.default = QueryBuilder;
