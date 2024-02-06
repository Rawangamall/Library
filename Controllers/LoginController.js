const JWT = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { promisify } = require("util");

const { User, Borrower } = require("./../Models/UserModel");
const BorrowerClass = require("./../Classes/BorrowerClass");
const catchAsync = require('./../Utils/CatchAsync'); 
const AppError = require('./../Utils/appError');
const TwilioService = require('./../Utils/SMS_service');

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

class AuthBase {
    constructor(model) {
        this.model = model;
    }

    login = catchAsync(async (req,res,next)=>{
        const {email , password }  = req.body;
    
        if(!email || !password){
        return next(new AppError(` Missing paramters for login`, 404));
        }
    const user = await this.model.findOne({email:email}).select("+password");

    if(!user || !(await user.correctPassword(password, user.password))){
         return next(new AppError(`Incorrect email or password`, 401));
           }       
        
    if(user.active == false){
        return next(new AppError(`You're not allowed to login!, U're not active now`, 401));
    }
       
    
    const token = JWT.sign({id:user._id , role:user.role},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE_IN});

    res.status(200).json({
        status:"success" , 
        token
    });
    });
    
     forgetpassword = catchAsync(async (req,res,next)=>{
        const user = await this.model.findOne({email:req.body.email});
        if(!user){
            return next(new AppError(`User of that email not found`, 401));
        }
        const isSMSSent = await TwilioService.sendSMS(user.phoneNumber);
        if (isSMSSent) {
            return res.status(200).json({ message: "Success: SMS sent for password reset" });
        } else {
            return next(new AppError("Error sending SMS. Please try again later!", 400));
        }
    
    });
    
    
     resetpassword = catchAsync(async (req,res,next)=>{
    
        const otp = req.body.code
        const newPassword = req.body.password;
        const phone = req.body.phone
    
        const user = await this.model.findOne({ phoneNumber: phone});
        if (!user) {
            return next(new AppError(`User with that phone number not found`, 401));
        }

        const verify = await TwilioService.verifyUser(phone , otp)
        if(!verify){
        return next(new AppError("invalid otp code"),400);
        }
    
        if(!newPassword || (req.body.confirmPassword) != newPassword) {
            return next(new AppError("Enter valid password and its match"),400);
        }else{
        user.password = bcrypt.hashSync(newPassword ,salt) 
        console.log(user.password)

        await user.save();
    console.log("after")
        }
    
    res.status(200).json({message:"success"});
    
    });

    SendVerifactionCode =  catchAsync(async (req,res,next)=>{
        const token = req.headers.authorization.split(' ')[1];
        if(!token){
        return next(new AppError('You\'re not logged in, please go to login page',401));
        }
        const decoded = await promisify(JWT.verify)(token,process.env.JWT_SECRET);
    
        //verify if the user of that token still exist
        const user = await this.model.findById(decoded.id);
        if(!user){
        return next(new AppError("The user of that token no longer exist"),401)
        }
    
        const isSMSSent = await TwilioService.sendSMS(user.phoneNumber);
    
        if (!isSMSSent){
            return next(new AppError("Error sending SMS. Please try again later!", 500));
        }
    
        return res.status(200).json({ message: "Success: SMS sent for Verifaction" });
    
    })
    
    phoneVerify =  catchAsync(async (req,res,next)=>{
        
        const otp = req.body.code
        const token = req.headers.authorization.split(' ')[1];
        if(!token){
        return next(new AppError('You\'re not logged in, please go to login page',401));
        }
        const decoded = await promisify(JWT.verify)(token,process.env.JWT_SECRET);
    
        //verify if the user of that token still exist
        const user = await this.model.findById(decoded.id);
        if(!user){
        return next(new AppError("The user of that token no longer exist"),401)
        }
    console.log(user.phoneNumber , otp)
        const verify = await TwilioService.verifyUser(user.phoneNumber , otp)
        if(!verify){
    
      res.status(400).json({ message: "invalid otp code" });
    
        }
    
        user.phoneVerify = true
        await user.save();
        
        res.status(200).json({ message: "Success: Ur Phone Verified" });
    });

     isValidToken = async (req,res,next)=>{
        const token = req.headers.authorization;
    
        try {
            
            const decoded = JWT.verify(token, process.env.JWT_SECRET);
        
            //console.log(decoded)
            const expirationDate = new Date(decoded.exp * 1000); 
            const currentDate = new Date();
        
            if (currentDate > expirationDate) {
              return res.status(401).json({ message: 'Token expired' });
            }
        
            return res.status(200).json({ message: 'Token is valid' });
          } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
          }
    }
}


class BorrowerAuth extends AuthBase {
    constructor() {
        super(Borrower); // Override the model
    }

    Register =  catchAsync(async (req, res, next) =>{

        const hash = await bcrypt.hash(req.body.password, salt);
        const { firstName, lastName,phoneNumber,role, email,wishlist} = req.body;
  
        const newBorrower = new BorrowerClass(firstName, lastName,phoneNumber,role, email,hash,wishlist);
         // console.log(typeof(newBorrower),newBorrower)
        const borrower = new Borrower(newBorrower);
        await borrower.save();
   
        res.status(201).json(newBorrower);
      }
    );
  
}

class UserAuth extends AuthBase {
    constructor() {
        super(User);         
    }
}

const userAuth = new UserAuth();
const borrowerAuth = new BorrowerAuth();

module.exports ={ userAuth , borrowerAuth}; 
