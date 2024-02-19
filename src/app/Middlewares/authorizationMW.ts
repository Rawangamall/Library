import { Request, Response, NextFunction } from 'express';
import JWT from "jsonwebtoken";
import { promisify } from "util";
import AppError from '../Utils/appError';


export const authorize = (roles :Array<String>) => {
    return async  (req:Request, res:Response, next:NextFunction) => {
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
           token = req.headers.authorization.split(' ')[1];
        }
        if(!token){
           return next(new AppError('You\'re not logged in, please go to login page',401));
        }
       
        type VerifyCallback = (token: string, secret: string) => Promise<any>;
        const decoded = await (promisify(JWT.verify) as VerifyCallback)(token, process.env.JWT_SECRET as string);       
        const userRole = decoded.role;

        if (!roles.includes(userRole)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  
      next();
    };
  };