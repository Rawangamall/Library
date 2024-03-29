import { body } from "express-validator";
import { Borrower } from "./../../Models/UserModel";

export const BorrowerValidPOST = [
  body('firstName').isString().withMessage('Please enter your name'),
  body('lastName').isString().withMessage('Please enter your name'),
  body('email')
  .isEmail().withMessage('enter valid email - يجب ادخال الايميل الصحيح')
  .custom(async (value) => {
    if(value){
    const user = await Borrower.findOne( { email: value } );
      if (user) {
        return Promise.reject('Email already in use - هذا الايميل مستخدم');
      }
    }
    }),
      body('password').isStrongPassword().withMessage('enter strong password include numbers and signs - يجب أن تكون كلمة المرور قوية. يجب أن تحتوي على أحرف كبيرة وصغيرة وأرقام ورموز.'),
      body('phoneNumber').isMobilePhone('ar-EG').withMessage('Please enter a valid Egyptian phone number')
      .custom(async (value) => {
        if(value){
        const user = await Borrower.findOne( { phoneNumber: value } );
          if (user) {
            return Promise.reject('Phone already in use - هذا الرقم مستخدم');
          }
        }
        }),
];

export const BorrowerValidPATCH = [
    body('firstName').isString().optional().withMessage('Please enter your name'),
    body('lastName').isString().optional().withMessage('Please enter your name'),
    body('email')
    .isEmail().optional().withMessage('enter valid email - يجب ادخال الايميل الصحيح')
    .custom(async (value) => {
  
      const user = await Borrower.findOne({ where: { email: value } });
        if (user) {
          return Promise.reject('Email already in use - هذا الايميل مستخدم');
        }
      }),
        body('password').isStrongPassword().optional().withMessage('enter strong password include numbers and signs - يجب أن تكون كلمة المرور قوية. يجب أن تحتوي على أحرف كبيرة وصغيرة وأرقام ورموز.'),
        body('phoneNumber').isMobilePhone('ar-EG').withMessage('Please enter a valid Egyptian phone number').optional()
        .custom(async (value) => {
          if(value){
          const user = await Borrower.findOne( { phoneNumber: value } );
            if (user) {
              return Promise.reject('Phone already in use - هذا الرقم مستخدم');
            }
          }
          }),  
        ];