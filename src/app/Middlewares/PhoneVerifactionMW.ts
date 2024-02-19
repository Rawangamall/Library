import { Request, Response, NextFunction } from 'express';
import JWT from "jsonwebtoken";
import { promisify } from "util";
import { User, Borrower } from "./../Models/UserModel";
import catchAsync from './../Utils/CatchAsync';
import AppError from './../Utils/appError';

class VerifyBase {
  model: typeof User | typeof Borrower;

  constructor(model: typeof User | typeof Borrower) {
    this.model = model;
  }

  Verify = catchAsync(async (req, res, next)=> {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return next(new AppError('You\'re not logged in, please go to login page', 401));
    }

    
    type VerifyCallback = (token: string, secret: string) => Promise<any>;
    const decoded = await (promisify(JWT.verify) as VerifyCallback)(token, process.env.JWT_SECRET as string);  

      const user = await this.model.findById(decoded.id);

      if (!user || !user.phoneVerify) {
        return next(new AppError('You\'re not verified your number, please go to verify it first', 401));
      }

      next();

  });
}

 const userPHVerifyMW = new VerifyBase(User);
const borrowerPHVerifyMW = new VerifyBase(Borrower);

export { userPHVerifyMW, borrowerPHVerifyMW };

