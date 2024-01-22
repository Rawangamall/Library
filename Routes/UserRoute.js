const express=require("express");
const router=express.Router();
const multer = require('multer');
const upload = multer();

const userController=require("./../Controllers/UserController");
const validationData = require("./../Core/Validations/User")
const validationMW = require("./../Middlewares/validateMW")
const auth = require("./../Middlewares/authenticationMW").auth
const authorize = require("./../Middlewares/authorizationMW").authorize
const limitMW = require("./../Middlewares/rateLimitMW")


router.route("/users")
      .post(limitMW.rateLimit,upload.none(),validationData.UserValidPOST,validationMW,userController.createUser)   //auth,authorize(["borrower","employee"]),
      .get(limitMW.rateLimit,userController.getAllUsers)   //auth,authorize(["borrower","employee"]),

router.route("/user/:id")
      .get(limitMW.rateLimit,userController.getUserProfile)   //auth,authorize(["borrower","employee"]),
      .patch(limitMW.rateLimit,upload.none(),userController.UpdateUser)
      .delete(limitMW.rateLimit,userController.delUser)

module.exports=router;