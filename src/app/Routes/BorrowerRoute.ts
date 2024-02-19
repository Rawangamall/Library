import express from "express";
const router=express.Router();
import multer from 'multer';
const upload = multer();

import BorrowerController from "./../Controllers/BorrowerController";
import {BorrowerValidPATCH} from "./../Core/Validations/Borrower";
import validationMW from "./../Middlewares/validateMW";
const auth = require("./../Middlewares/authenticationMW").auth
const authorize = require("./../Middlewares/authorizationMW").authorize
import {rateLimit} from "./../Middlewares/rateLimitMW";
import { userPHVerifyMW} from "./../Middlewares/PhoneVerifactionMW";


router.route("/borrowers")
      .get({rateLimit}.rateLimit,auth,authorize(['admin', 'manager']),BorrowerController.getAllBorrowers)  

router.route("/borrower/:id")
      .get({rateLimit}.rateLimit,auth,authorize(['admin','employee', 'manager','borrower']),BorrowerController.getBorrowerProfile)   
      .patch({rateLimit}.rateLimit,upload.none(),auth,authorize(['borrower']),BorrowerValidPATCH,validationMW,BorrowerController.updateBorrower)  
      .delete({rateLimit}.rateLimit,auth,authorize(['admin']),BorrowerController.deleteBorrower) 
      .post({rateLimit}.rateLimit,upload.none(),auth,authorize(['borrower']),BorrowerController.addWishBook)  //id param = bookid

export default router;
