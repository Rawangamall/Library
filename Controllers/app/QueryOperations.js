"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AbstractQueryUtility {
    search(query, searchTerm, Fields) {
        if (Fields && Fields.length > 0) {
            const orConditions = Fields.map((field) => ({ [field]: { $regex: searchTerm, $options: 'i' } }));
            return query.or(orConditions);
        }
        return query;
    }
}
class QueryUtility extends AbstractQueryUtility {
    sort(query, sortCriteria) {
        return query.sort(sortCriteria);
    }
    limit(query, limit) {
        return query.limit(limit);
    }
}
exports.default = QueryUtility;
