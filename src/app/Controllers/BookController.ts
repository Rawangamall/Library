import Book from './../Models/BookModel';
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
        const {title,author ,quantity,floor,section,shelf,type,fee} = req.body;
        const shelfLocation = `${floor}-${section.toUpperCase()}-${shelf}`;

        if(type === 'free'){
            newBook = new BookClass(title,author ,parseInt(quantity),shelfLocation);
        }else if(type === 'rental'){
           newBook = new RentalBook(title,author ,parseInt(quantity),shelfLocation,parseInt(fee));
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
}  

export default BookController;