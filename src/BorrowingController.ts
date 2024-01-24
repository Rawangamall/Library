import BookBorrowing from '@models/BorrowingModel';
const JWT= require("jsonwebtoken");
const { promisify } = require("util")
const CatchAsync = require('./../Utils/CatchAsync');
import { Request ,Response,NextFunction} from 'express';

class BorrowingOperations {

    static createOperations =  CatchAsync(async (req:Request,res:Response,next:NextFunction)=>{

})
}

export default BorrowingOperations;
