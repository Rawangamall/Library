const { body} = require("express-validator");
const {User} = require("./../../Models/UserModel");
const validRoles = ['admin','employee', 'manager'];

exports.UserValidPOST = [
    body('firstName').isString().withMessage('Please enter your first name'),
    body('lastName').isString().withMessage('Please enter your last name'),
    body('email').isEmail().withMessage('Enter a valid email')
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        return Promise.reject('Email already in use');
      }
    }),
      body('password').isStrongPassword().withMessage('enter strong password include numbers and signs - يجب أن تكون كلمة المرور قوية. يجب أن تحتوي على أحرف كبيرة وصغيرة وأرقام ورموز.'),
      body('phoneNumber').isMobilePhone().withMessage('Please enter a valid phone number') .custom(async (value) => {
        if(value){
        const user = await User.findOne( { phoneNumber: value } );
          if (user) {
            return Promise.reject('Phone already in use - هذا الرقم مستخدم');
          }
        }
        }),   
       body('role').isIn(validRoles).withMessage('Invalid role. Choose from: admin, employee, manager'),
      body('salary').isNumeric().withMessage('Please enter a valid salary in number')
];

exports.UserValidPATCH = [
    body('firstName').isString().optional().withMessage('Please enter your name'),
    body('lastName').isString().optional().withMessage('Please enter your name'),
    body('email')
    .isEmail().optional().withMessage('enter valid email - يجب ادخال الايميل الصحيح')
    .custom(async (value) => {
  
      const user = await User.findOne( { email: value });
      if (user) {
          return Promise.reject('Email already in use - هذا الايميل مستخدم');
        }
      }),
        body('password').isStrongPassword().optional().withMessage('enter strong password include numbers and signs - يجب أن تكون كلمة المرور قوية. يجب أن تحتوي على أحرف كبيرة وصغيرة وأرقام ورموز.'),
        body('phoneNumber').isMobilePhone().optional().withMessage('Please enter a valid phone number') .custom(async (value) => {
          if(value){
          const user = await User.findOne( { phoneNumber: value } );
            if (user) {
              return Promise.reject('Phone already in use - هذا الرقم مستخدم');
            }
          }
          }),          
        body('salary').isNumeric().optional().withMessage('Please enter a valid salary in number'),
        body('role').isIn(validRoles).optional().withMessage('Invalid role. Choose from: admin,  employee, manager'),

  ];