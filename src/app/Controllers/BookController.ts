import * as JWT from 'jsonwebtoken';
import { promisify } from 'util';

import Book from './../Models/BookModel';
import Rating from './../Models/RatingModel';
import { BookClass, RentalBook } from './../Classes/BookClass';
import QueryOperation from './QueryOperations';
import CatchAsync from './../Utils/CatchAsync';

interface GetUsersQueryParams {
  searchTerm?: string;
  limit?: string;
  sortField?: string;
}

class BookController {
  
    static createBook =  CatchAsync(async (req, res, next) =>{
        let newBook;
        const {title,author ,quantity,floor,section,shelf,type,fee ,sales} = req.body;
        const shelfLocation = `${floor}-${section.toUpperCase()}-${shelf}`;

        if(type === 'free'){
            newBook = new BookClass(title,author ,parseInt(quantity),shelfLocation,sales);
        }else if(type === 'rental'){
           newBook = new RentalBook(title,author ,parseInt(quantity),shelfLocation,parseInt(fee),sales);
        }
        
        const book = new Book(newBook);
        await book.save();
   
        res.status(201).json(newBook);
      }
    );

    static getBook = CatchAsync(async (req, res, next) => {
        const bookId = req.params.id;
        const book = await Book.findById(bookId);
        if (!book) {
          return res.status(400).json({ error: "book not found" });
        }
        res.status(200).json(book);
    
    })
  
    static getAllBooks =CatchAsync(async (req,res,next)=>{
      const { searchTerm, limit }: GetUsersQueryParams = req.query;
      const limitValue: number = typeof limit === 'string' ? parseInt(limit) : 7;
      const sortField: string = req.query.sortField as string || "createdAt"; 
  
      const queryOperations = new QueryOperation();

      let bookQuery =  Book.find()

      if (searchTerm) {
        bookQuery = queryOperations.search(bookQuery, searchTerm , ['author', 'title', 'bookType','shelfLocation']);
      }
  
      const filteredBooksQuery = queryOperations.sort(queryOperations.limit(bookQuery, limitValue), sortField); //nested query
      const books = await filteredBooksQuery.exec();
  
      if(books.length == 0){
          return res.status(400).json({ error: "There's no book" });
      }
  
      res.status(200).json(books);
  
    });
  
    static UpdateBook =CatchAsync(async (req,res,next)=>{
      const bookId = req.params.id;
      const existbook = await Book.findById(bookId);

      if (!existbook) {
        return res.status(400).json({ error: "book not found" });
      }

       if (req.body.quantity) req.body.quantity = parseInt(req.body.quantity);
       if (req.body.floor) {
        existbook.shelfLocation = `${req.body.floor}-${existbook.shelfLocation.split('-')[1]}-${existbook.shelfLocation.split('-')[2]}`;
        }
        if (req.body.section) {
            existbook.shelfLocation = `${existbook.shelfLocation.split('-')[0]}-${req.body.section}-${existbook.shelfLocation.split('-')[2]}`;
        }
        if (req.body.shelf) {
            existbook.shelfLocation = `${existbook.shelfLocation.split('-')[0]}-${existbook.shelfLocation.split('-')[1]}-${req.body.shelf}`;
        }
  
        const UniqueLocation = await Book.findOne({ shelfLocation: existbook.shelfLocation, _id: { $ne: bookId } });  
        if(UniqueLocation)
        {return res.status(400).json({messsage:'Shelf location already filled with another book'})}

        const book = await Book.findByIdAndUpdate(
          bookId,
          {
              title: req.body.title,
              author: req.body.author,
              availableQuantity: req.body.quantity,
              shelfLocation : existbook.shelfLocation ,
          },
          { new: true } 
        );
  
        res.status(200).json(book);
  
    });
  
    static delBook =CatchAsync(async (req,res,next)=>{
      const bookId = req.params.id;
      const book = await Book.findByIdAndDelete(bookId);
      if(!book){
          return res.status(400).json({ error: "There's no book" });
      }
  
      res.status(200).json(book);
  
    });

  static BestsellerBooks = CatchAsync(async (req,res,next)=> {
    
    const limit = parseInt(req.query?.limit as string) || 10
    const books = await Book.find().sort("-sales").limit(limit)

    if(books.length == 0){
     res.status(404).json({message:"No books borrowed yet"})
    }

    res.status(200).json(books)
  });

  static popularBooks = CatchAsync(async (req,res,next) =>{
    const limit = parseInt(req.query?.limit as string) || 10

    const books = await Book.find({ rating: { $in: [9, 10] } }).limit(limit)    //.explain('executionStats')
    res.json({message:"success",books})
  });

  static rateBook = CatchAsync(async (req,res,next)=>{
    const bookId = req.params.id;
    const value = parseInt(req.body?.value as string);

    const token = req.headers.authorization?.split(' ')[1];

    if(!token){
        return res.status(401).json('You\'re not logged in, please go to login page');
     }

     type VerifyCallback = (token: string, secret: string) => Promise<any>;
     const decoded = await (promisify(JWT.verify) as VerifyCallback)(token, process.env.JWT_SECRET as string);

     const book = await Book.findById(bookId)
     if(!book){
      res.status(404).json({message:"Book not found to be rated"})
     }

     const existingRating = await Rating.findOne({ user: decoded.id, book: bookId });

     // If the user already rated the book, update the existing rating
     if (existingRating) {

         existingRating.ratingValue = value;
         await existingRating.save();

     } else {
         const rating = new Rating({
             user: decoded.id,
             book: bookId,
             ratingValue: value
         });
         await rating.save();
     }

    //new average rating for the book
    const ratings = await Rating.find({ book: bookId });

    const sumRatings = ratings.reduce((sum, rating) => sum + rating.ratingValue, 0);
    const averageRating = ratings.length === 0 ? 0 : sumRatings / ratings.length;

     book.rating = averageRating
     await book.save();

    res.status(200).json({message:'Rating success'});
  });
}  


export default BookController;