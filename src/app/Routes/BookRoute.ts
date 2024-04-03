import express from "express";
const router=express.Router();
import multer from 'multer';
const upload = multer();

import BookController from "./../Controllers/BookController";
import {BookValidPATCH,BookValidPOST} from "./../Core/Validations/Book";
import {RateValidPOST} from "./../Core/Validations/Rate";

import validationMW from "./../Middlewares/validateMW";
const auth = require("./../Middlewares/authenticationMW").auth
const authorize = require("./../Middlewares/authorizationMW").authorize
import { rateLimit } from "./../Middlewares/rateLimitMW";
import { userPHVerifyMW} from "./../Middlewares/PhoneVerifactionMW";


router.route("/books")
      .post({rateLimit}.rateLimit,upload.none(),BookValidPOST,validationMW,BookController.createBook)    //auth,authorize(['employee', 'manager']),
      .get({rateLimit}.rateLimit,BookController.getAllBooks)    //auth,authorize(['admin','employee', 'manager','borrower']),

router.route("/book/:id")
      .patch({rateLimit}.rateLimit,upload.none(),BookValidPATCH,validationMW,BookController.UpdateBook) //auth,authorize(['employee', 'manager']),
      .get({rateLimit}.rateLimit,BookController.getBook)  //auth,authorize(['admin','employee', 'manager','borrower']),
      .delete(BookController.delBook)  //auth,authorize(['employee', 'manager']),
      
router.route("/books/bestseller")
       .get(BookController.BestsellerBooks)

router.route("/books/popularBooks")
      .get(BookController.popularBooks)

router.route("/rating/:id")
      .post({rateLimit}.rateLimit,upload.none(),auth,authorize(['borrower']),RateValidPOST,validationMW,BookController.rateBook)

export default router;
