const express=require("express");
const router=express.Router();
const multer = require('multer');
const upload = multer();

const {userAuth , borrowerAuth}=require("./../Controllers/LoginController");
const validationData = require("./../Core/Validations/User")
const validationMW = require("./../Middlewares/validateMW")


router.route("/register")   //for borrowers only - user added by admin
      .post(upload.none() )  

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



module.exports=router;