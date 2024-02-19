"use strict";
//For programming error
Object.defineProperty(exports, "__esModule", { value: true });
const CatchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
exports.default = CatchAsync;
