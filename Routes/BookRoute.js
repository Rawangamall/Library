const express=require("express");
const router=express.Router();
const multer = require('multer');
const upload = multer();

const BookController=require("./../Controllers/BookController");
const validationData = require("./../Core/Validations/Book")
const validationMW = require("./../Middlewares/validateMW")
const auth = require("./../Middlewares/authenticationMW").auth
const authorize = require("./../Middlewares/authorizationMW").authorize
const limitMW = require("./../Middlewares/rateLimitMW")
const PHVerifyMW = require("./../Middlewares/PhoneVerifactionMW").userPHVerifyMW.Verify


router.route("/books")
      .post(limitMW.rateLimit,upload.none(),validationData.BookValidPOST,validationMW,BookController.createBook)    //auth,authorize(['employee', 'manager']),
      .get(limitMW.rateLimit,BookController.getAllBooks)    //auth,authorize(['admin','employee', 'manager','borrower']),

router.route("/book/:id")
      .patch(limitMW.rateLimit,upload.none(),validationData.BookValidPATCH,validationMW,BookController.UpdateBook) //auth,authorize(['employee', 'manager']),
      .get(limitMW.rateLimit,BookController.getBook)  //auth,authorize(['admin','employee', 'manager','borrower']),
      .delete(BookController.delBook)  //auth,authorize(['employee', 'manager']),
      


module.exports=router;