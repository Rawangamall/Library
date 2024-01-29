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
      .get(auth,authorize(['admin', 'manager']),limitMW.rateLimit,BorrowerController.getAllBorrowers)  

router.route("/borrower/:id")
      .get(limitMW.rateLimit,BorrowerController.getBorrowerProfile)   //auth,authorize(['admin','employee', 'manager']),
      .patch(limitMW.rateLimit,upload.none(),validationData.BorrowerValidPATCH,validationMW,BorrowerController.updateBorrower)   //auth,authorize(['admin','employee', 'manager']),
      .delete(limitMW.rateLimit,BorrowerController.deleteBorrower)   //auth,authorize(['admin']),

module.exports=router;