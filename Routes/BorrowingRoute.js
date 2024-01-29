const express=require("express");
const router=express.Router();
const multer = require('multer');
const upload = multer();

const BorrowingOperations =require("../Controllers/BorrowingController").default;;
//const validationData = require("../Core/Validations/User")
const validationMW = require("../Middlewares/validateMW")
const auth = require("../Middlewares/authenticationMW").auth
const authorize = require("../Middlewares/authorizationMW").authorize
const limitMW = require("../Middlewares/rateLimitMW")


router.route("/operation/:id")  //bookID
      .post(limitMW.rateLimit,auth,authorize(['borrower']),upload.none(),validationMW,BorrowingOperations.borrowBook)   //auth,authorize(['borrower']),
      .get(auth,authorize(['admin', 'manager']),limitMW.rateLimit)  
      .patch(auth,authorize(['borrower']),limitMW.rateLimit,BorrowingOperations.returnBook)

module.exports=router;