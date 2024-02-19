import express from "express";
const router=express.Router();
import multer from 'multer';
const upload = multer();

import BorrowingOperations from "../Controllers/BorrowingController";
import {BorrowingValidGet , BorrowingValidPOST} from "../Core/Validations/Operation";
import validationMW from "../Middlewares/validateMW";
const auth = require("../Middlewares/authenticationMW").auth
const authorize = require("../Middlewares/authorizationMW").authorize
import { rateLimit } from "../Middlewares/rateLimitMW";
import { borrowerPHVerifyMW ,userPHVerifyMW} from "./../Middlewares/PhoneVerifactionMW";


router.route("/operation/:id")  //bookID
      .post({rateLimit}.rateLimit,auth,authorize(['borrower']),upload.none(),borrowerPHVerifyMW.Verify,BorrowingValidPOST,validationMW,BorrowingOperations.borrowBook)   //auth,authorize(['borrower']),
      .get(auth,authorize(['admin', 'manager']),{rateLimit}.rateLimit)  
      .patch(auth,authorize(['borrower']),{rateLimit}.rateLimit,BorrowingOperations.returnBook)

router.route("/operations")
       .get(auth,authorize(['admin', 'manager']),BorrowingValidGet,validationMW,BorrowingOperations.OperationList)

export default router;
