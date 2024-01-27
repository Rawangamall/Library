const JWT= require("jsonwebtoken");
const { promisify } = require("util")

const {User} = require("./../Models/UserModel")

const AppError = require("./../Utils/appError");
const catchAsync = require("./../Utils/CatchAsync");

exports.auth = catchAsync(async (req,res,next)=>{
 
 let token;
 if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token = req.headers.authorization.split(' ')[1];
 }
 if(!token){
    return next(new AppError('You\'re not logged in, please go to login page',401));
 }

const decoded = await promisify(JWT.verify)(token,process.env.JWT_SECRET);

//verify if the user of that token still exist
const user = await User.findById(decoded.id);

if(!user){
    return next(new AppError("The user of that token no longer exist"),401)
}

 next()
});