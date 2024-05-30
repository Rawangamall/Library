"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const i18n = require('i18n');
i18n.configure({
    locales: ['en', 'ar'],
    directory: path_1.default.join(__dirname, "./../../../locales"),
    defaultLocale: 'en',
    queryParameter: 'lang',
    api: {
        '__': 'translate', // Use 'translate' as alias for 'res.__' function
        '__n': 'translateN' // Use 'translateN' as alias for 'res.__n' function
    }
});
exports.default = i18n;
