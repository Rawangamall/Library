import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path"; 
require("dotenv").config({ path: "config.env" });

 import LoginRoute from "./app/Routes/LoginRoute";
 import UserRoute from "./app/Routes/UserRoute";
 import BorrowerRoute from "./app/Routes/BorrowerRoute";
import BookRoute from "./app/Routes/BookRoute";
import OperationRoute from "./app/Routes/BorrowingRoute";

//server
const server = express();
let port= process.env.PORT||8080;

server.listen(port,()=>{
    console.log("server is listenng...",port);
});

//db connection
mongoose.set("strictQuery", true); //warning
mongoose.connect(process.env.DB_STRING as string)
	    .then(() => {
		 console.log("DB connected");
     	})
	   .catch((error) => {
		 console.log("Db connection Problem " + error);
    	});


server.use(
    cors({
      origin: "*",
    })
    );
    declare module 'http' {
        interface IncomingMessage {
            originalUrl?: string;
            rawBody?: string;
        }
    }
    
//body parse
server.use(express.urlencoded({extended:false}));
server.use(express.json({
    verify: function (req, res, buf) {
        var url = req.originalUrl;
        if (url?.startsWith('/rentBooks/charge')) {
            req.rawBody = buf.toString()
        }
    }
}));
//Routes 
 server.use(LoginRoute)
 server.use(UserRoute)
 server.use(BorrowerRoute)
server.use(BookRoute)
server.use(OperationRoute)

//Not Found Middleware
server.use((request, response, next) => {
	response.status(404).json({ message: `${request.originalUrl} not found on this server!` });
});

//Global error handeling Middleware
server.use((error: any, request: express.Request, response: express.Response, next: express.NextFunction) => {
    if (error.statusCode && error.statusCode !== 500) {
        // the specific status code from the AppError
        response.status(error.statusCode).json({ message: error.message });
    } else {
        response.status(500).json({ message: error + "" });
    }
});


export default server;
