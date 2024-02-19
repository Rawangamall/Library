"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
require("dotenv").config({ path: "config.env" });
const LoginRoute_1 = __importDefault(require("./app/Routes/LoginRoute"));
const UserRoute_1 = __importDefault(require("./app/Routes/UserRoute"));
const BorrowerRoute_1 = __importDefault(require("./app/Routes/BorrowerRoute"));
const BookRoute_1 = __importDefault(require("./app/Routes/BookRoute"));
const BorrowingRoute_1 = __importDefault(require("./app/Routes/BorrowingRoute"));
//server
const server = (0, express_1.default)();
let port = process.env.PORT || 8080;
server.listen(port, () => {
    console.log("server is listenng...", port);
});
//db connection
mongoose_1.default.set("strictQuery", true); //warning
mongoose_1.default.connect(process.env.DB_STRING)
    .then(() => {
    console.log("DB connected");
})
    .catch((error) => {
    console.log("Db connection Problem " + error);
});
server.use((0, cors_1.default)({
    origin: "*",
}));
//body parse
server.use(express_1.default.json());
server.use(express_1.default.urlencoded({ extended: false }));
//Routes 
server.use(LoginRoute_1.default);
server.use(UserRoute_1.default);
server.use(BorrowerRoute_1.default);
server.use(BookRoute_1.default);
server.use(BorrowingRoute_1.default);
//Not Found Middleware
server.use((request, response, next) => {
    response.status(404).json({ message: `${request.originalUrl} not found on this server!` });
});
//Global error handeling Middleware
server.use((error, request, response, next) => {
    if (error.statusCode && error.statusCode !== 500) {
        // the specific status code from the AppError
        response.status(error.statusCode).json({ message: error.message });
    }
    else {
        response.status(500).json({ message: error + "" });
    }
});
exports.default = server;
