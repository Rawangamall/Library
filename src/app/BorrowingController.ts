import { Request, Response, NextFunction } from 'express';
import * as JWT from 'jsonwebtoken';
import moment from 'moment';
import { promisify } from 'util';

const BookBorrowing = require('../../Models/BorrowingModel');
const Book = require('../../Models/BookModel');

const CatchAsync = require('../../Utils/CatchAsync');


class BorrowingOperations {

  static borrowBook = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const bookId = req.params.id;
    const token = req.headers.authorization?.split(' ')[1];

    if(!token){
        return res.status(401).json('You\'re not logged in, please go to login page');
     }
   
     type VerifyCallback = (token: string, secret: string) => Promise<any>;
     const decoded = await (promisify(JWT.verify) as VerifyCallback)(token, process.env.JWT_SECRET as string);

     const userId = decoded.id; 
    const { dueDate  } = req.body;

    const book = await Book.findById(bookId)
    if(book.availableQuantity <= 0  || !book){
        return res.status(400).json('Book Stock out, check it later!');
    }

    const operation = await BookBorrowing.findOne({book:bookId,borrower:userId,returned:false})
    if(operation){
      return res.status(400).json('You\'re already borrowed that book!');
    }

    let borrowingResult;
    if(book.bookType == "free"){
     borrowingResult =await BookBorrowing.create({borrower:userId, book:bookId, dueDate:dueDate});

    }else if(book.bookType == "rental"){

      //calculate the rent
      const currentDate = moment();
      const dueDateObj = moment(dueDate, 'YYYY-MM-DD', true);

      const diffInDays = dueDateObj.diff(currentDate, 'days');
      const rentAmount = diffInDays * book.rentalFee;
  
      req.body.rentAmount = rentAmount; 

     borrowingResult = await BookBorrowing.create({borrower:userId, book:bookId, dueDate:dueDate , rentalFee:rentAmount });

    }
    book.availableQuantity -=1;

    await borrowingResult.save();
    await book.save();

    res.status(201).json({data: borrowingResult });
  });

  static returnBook = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const bookId = req.params.id;
    const token = req.headers.authorization?.split(' ')[1];

    if(!token){
        return res.status(401).json('You\'re not logged in, please go to login page');
     }
     console.log(token,"token")

     type VerifyCallback = (token: string, secret: string) => Promise<any>;

     const decoded = await (promisify(JWT.verify) as VerifyCallback)(token, process.env.JWT_SECRET as string);
     const operation = await BookBorrowing.findOne({book:bookId,borrower:decoded.id})
     const book = await Book.findById(bookId)

     if(!operation || operation.returned){
      return res.status(400).json({message:"You didn't borrow this book or already returned :)"})
     }

     operation.returned = true
     book.availableQuantity +=1;

     await operation.save();
     await book.save();

     res.status(200).json({message:"The book is returned"})
  })

}

export default BorrowingOperations;
