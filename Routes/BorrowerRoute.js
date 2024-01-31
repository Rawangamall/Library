const express=require("express");
const router=express.Router();
const multer = require('multer');
const upload = multer();

const BorrowerController=require("./../Controllers/BorrowerController").default;
const validationData = require("./../Core/Validations/Borrower")
const validationMW = require("./../Middlewares/validateMW")
const auth = require("./../Middlewares/authenticationMW").auth
const authorize = require("./../Middlewares/authorizationMW").authorize
const limitMW = require("./../Middlewares/rateLimitMW")


router.route("/borrowers")
      .get(limitMW.rateLimit,auth,authorize(['admin', 'manager']),BorrowerController.getAllBorrowers)  

router.route("/borrower/:id")
      .get(limitMW.rateLimit,auth,authorize(['admin','employee', 'manager','borrower']),BorrowerController.getBorrowerProfile)   
      .patch(limitMW.rateLimit,upload.none(),auth,authorize(['borrower']),validationData.BorrowerValidPATCH,validationMW,BorrowerController.updateBorrower)  
      .delete(limitMW.rateLimit,auth,authorize(['admin']),BorrowerController.deleteBorrower) 
      .post(limitMW.rateLimit,upload.none(),auth,authorize(['borrower']),BorrowerController.addWishBook)  //id param = bookid

module.exports=router;