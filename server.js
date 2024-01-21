const express= require("express");
const cors = require("cors");
const path=require("path"); 
require("dotenv").config({ path: "config.env" });

// const LoginRoute = require("./Routes/LoginRoute");
// const UserRoute = require("./Routes/UserRoute");
// const BookRoute = require("./Routes/BookRoute");

//server
const server = express();
let port= process.env.PORT||8080;
server.listen(port,()=>{
    console.log("server is listenng.....",port);
});

//db connection
mongoose.set("strictQuery", true); //warning

mongoose.connect(process.env.DB_STRING)
	    .then(() => {
		 console.log("DB connected");
            server.listen(port, () => {
                console.log("server is listenng...", port);
            });
     	})
	   .catch((error) => {
		 console.log("Db connection Problem " + error);
    	});


server.use(
    cors({
      origin: "*",
    })
    );

//body parse
server.use(express.json());
server.use(express.urlencoded({extended:false}));

//Routes 
// server.use(LoginRoute)
// server.use(UserRoute)
// server.use(BookRoute)

//Not Found Middleware
server.use((request, response, next) => {
	response
		.status(404)
		.json({ message: `${request.originalUrl} not found on this server!` });
});

//Global error handeling Middleware
server.use((error, request, response, next) => {
	if (error.statusCode && error.statusCode !== 500) {
		// the specific status code from the AppError
		response.status(error.statusCode).json({ message: error.message });
	} else {
        response.status(500).json({ message: error + "" });
	}
});