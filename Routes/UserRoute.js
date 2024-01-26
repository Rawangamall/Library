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
      .post(limitMW.rateLimit,upload.none(),validationData.UserValidPOST,validationMW,userController.createUser)   //auth,authorize(['admin', 'manager']),
      .get(limitMW.rateLimit,userController.getAllUsers)   //auth,authorize(['admin', 'manager']),

router.route("/user/:id")
      .get(limitMW.rateLimit,userController.getUserProfile)   //auth,authorize(['admin','employee', 'manager']),
      .patch(limitMW.rateLimit,upload.none(),userController.UpdateUser)   //auth,authorize(['admin','employee', 'manager']),
      .delete(limitMW.rateLimit,userController.delUser)   //auth,authorize(['admin']),

module.exports=router;