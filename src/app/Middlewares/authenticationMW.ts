import { Request, Response, NextFunction } from 'express';
import JWT from "jsonwebtoken";

import { User } from "./../Models/UserModel";
import { Borrower } from "./../Models/UserModel";

import AppError from "./../Utils/appError";
import catchAsync from "./../Utils/CatchAsync";
import { promisify } from 'util';

exports.auth = catchAsync(async (req:Request, res:Response, next:NextFunction)=>{
 
 let token;
 if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token = req.headers.authorization.split(' ')[1];
 }
 if(!token){
    return next(new AppError('You\'re not logged in, please go to login page',401));
 }

 type VerifyCallback = (token: string, secret: string) => Promise<any>;
 const decoded = await (promisify(JWT.verify) as VerifyCallback)(token, process.env.JWT_SECRET as string);

 if (decoded.exp <= Date.now() / 1000) {
   return next(new AppError('Your token has expired. Please log in again.', 401));
 }

//verify if the user of that token still exist
const user = await User.findById(decoded.id);
const borrower = await Borrower.findById(decoded.id);

if(!user && !borrower){
    return next(new AppError("The user of that token no longer exist",401))
}

 next()
});