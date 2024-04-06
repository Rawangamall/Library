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
        this.model = model;
        this.query = this.model.find();
    }
    find(query) {
        this.query = this.model.find(query);
        return this;
    }
    filterReturned(returned) {
        if (returned) {
            this.query = this.query.where('returned').equals(returned);
        }
        return this;
    }
    sort(sortOptions) {
        this.query = this.query.sort(sortOptions);
        return this;
    }
    limit(limit) {
        this.query = this.query.limit(limit);
        return this;
    }
    populate(path, select) {
        this.query = this.query.populate(path, select);
        return this;
    }
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query.exec();
        });
    }
}
exports.default = QueryBuilder;
