import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcrypt';

const {Borrower} = require('./../../Models/UserModel');
const Book = require('./../../Models/BookModel');
const Operations = require('./../../Models/BorrowingModel');
const CatchAsync = require('./../../Utils/CatchAsync');

import QueryOperation from './QueryOperations';
import { promisify } from 'util';
import * as JWT from 'jsonwebtoken';


const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

class BorrowerController {

  static getBorrowerProfile = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const borrowerId = parseInt(req.params.id);
    const borrower = await Borrower.findById(borrowerId);

    if (!borrower) {
      return res.status(400).json({ error: 'Borrower not found' });
    }
    res.status(200).json(borrower);
  });

  static getAllBorrowers = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { searchTerm, sortField, limit } = req.query as { searchTerm?: string; sortField?: string; limit?: string };

    let queryOperations = new QueryOperation();

    let borrowersQuery = Borrower.find();

    if (searchTerm) {
      borrowersQuery = queryOperations.search(borrowersQuery, searchTerm , ['email', 'phoneNumber']);
    }
    const filteredUsersQuery = queryOperations.sort(queryOperations.limit(borrowersQuery,  parseInt((limit || '5').toString())), sortField || 'createdAt'); //nested query
    const borrowers = await filteredUsersQuery.exec();

    if (borrowers.length === 0) {
      return res.status(200).json({ message: "There's no borrower" });
    }
    res.status(200).json(borrowers);
  });

  static updateBorrower = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const borrowerId = parseInt(req.params.id);

    if (req.body.password) {
      const hash = await bcrypt.hash(req.body.password, salt);
      req.body.password = hash;
    }

    const borrower = await Borrower.findByIdAndUpdate(
      borrowerId,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        password: req.body.password,
      },
      { new: true } // Return the updated document
    );

    if (!borrower) {
      return res.status(400).json({ error: 'Borrower not found' });
    }

    res.status(200).json(borrower);
  });

  static deleteBorrower = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const borrowerId = parseInt(req.params.id);

    const borrowerUser = await Borrower.findById(borrowerId);
    if (!borrowerUser) {
      return res.status(404).json({ error: "borrower not found" });
    }
  
    const operations = await Operations.find({ borrower: borrowerId, returned: false });
    //console.log(operations , operations.length)

    if (operations.length > 0) {
      const borrowedBooks = await Book.find({ _id: { $in: operations.map((operation:any) => operation.book) } })
  
      return res.status(400).json({
        message: 'Borrower has books that haven\'t been returned',
        operationIds: operations.map((operation: any) => operation._id),
        borrowedBooks:borrowedBooks
      });
    }
    const borrower = await Borrower.findByIdAndDelete(borrowerId);
    res.status(200).json(borrower);
  });

  static addWishBook = CatchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const bookId = req.params.id;
    const token = req.headers.authorization?.split(' ')[1];

    if(!token){
        return res.status(401).json('You\'re not logged in, please go to login page');
     }
    
     type VerifyCallback = (token: string, secret: string) => Promise<any>;

     const decoded = await (promisify(JWT.verify) as VerifyCallback)(token, process.env.JWT_SECRET as string);
     const userId = decoded.id; 

     const book = Book.findById(bookId);
     if(!book){
      return res.status(400).json({message:'Book not found'});
     }

    const borrower = await Borrower.findById(userId);
    if (borrower.wishList.length > 0 && borrower.wishList.includes(bookId)) {
      return res.status(400).json({message:'Book is already in ur wishlist'});      
  }

    borrower.wishList.push(bookId);
    await borrower.save()
    
    res.status(200).json({message:'Book added to ur wishlist :)'});
  })
}

export default BorrowerController;
