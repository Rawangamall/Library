import express from "express";
const router=express.Router();
import multer from 'multer';
const upload = multer();

import userController from "./../Controllers/UserController";
import {UserValidPOST,UserValidPATCH} from "./../Core/Validations/User";
import validationMW from "./../Middlewares/validateMW";
const auth = require("./../Middlewares/authenticationMW").auth
import {authorize} from "./../Middlewares/authorizationMW";
import {rateLimit} from "./../Middlewares/rateLimitMW";
import {userPHVerifyMW} from "./../Middlewares/PhoneVerifactionMW";


router.route("/users")
      .post({rateLimit}.rateLimit,upload.none(),UserValidPOST,validationMW,userController.createUser)   //auth,authorize(['admin', 'manager']),
      .get(auth,authorize(['admin', 'manager']),{rateLimit}.rateLimit,userController.getAllUsers)  //{userPHVerifyMW},

router.route("/user/:id")
      .get({rateLimit}.rateLimit,userController.getUserProfile)   //auth,authorize(['admin','employee', 'manager']),
      .patch({rateLimit}.rateLimit,upload.none(),UserValidPATCH,userController.UpdateUser)   //auth,authorize(['admin','employee', 'manager']),
      .delete({rateLimit}.rateLimit,userController.delUser)   //auth,authorize(['admin']),

export default router;
