import express from "express";
const router=express.Router();
import multer from 'multer';
const upload = multer();

import { userAuth, borrowerAuth } from "./../Controllers/LoginController";
import {BorrowerValidPOST } from "./../Core/Validations/Borrower";
import validationMW from "./../Middlewares/validateMW";
const auth = require("./../Middlewares/authenticationMW").auth


router.route("/register")   //for borrowers only - user added by admin
      .post(upload.none(),BorrowerValidPOST,validationMW,borrowerAuth.Register)  

router.route("/login")   //for borrowers 
      .post(upload.none(),borrowerAuth.login)  

      
router.route("/forgetpassword")   //for borrowers
.post(upload.none(),borrowerAuth.forgetpassword)  

router.route("/resetpassword")   //for borrowers 
.patch(upload.none(),borrowerAuth.resetpassword)  


router.route("/dashboard/login")   //for dashboard users 
      .post(upload.none(),userAuth.login)  

router.route("/dashboard/forgetpassword")   //for dashboard users 
      .post(upload.none(),userAuth.forgetpassword)  

router.route("/dashboard/resetpassword")   //for dashboard users 
      .patch(upload.none(),userAuth.resetpassword)  

router.route("/user/PhoneVerify")
      .get(auth , userAuth.SendVerifactionCode) 
      .patch(auth,upload.none(),userAuth.phoneVerify)   

router.route("/borrower/PhoneVerify")
      .get(auth , borrowerAuth.SendVerifactionCode) 
      .patch(auth,upload.none(),borrowerAuth.phoneVerify)   

export default router;
