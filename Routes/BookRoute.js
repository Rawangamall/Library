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


router.route("/books")
      .post(limitMW.rateLimit,upload.none(),validationData.BookValidPOST,validationMW,BookController.createBook)   
      .get(limitMW.rateLimit,BookController.getAllBooks)   

router.route("/book/:id")
      .patch(limitMW.rateLimit,upload.none(),validationData.BookValidPATCH,validationMW,BookController.UpdateBook)   
      .get(limitMW.rateLimit,BookController.getBook)
      .delete(BookController.delBook)
      


module.exports=router;