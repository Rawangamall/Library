const Book = require('./../Models/BookModel');
const BookClass = require('./../Classes/BookClass');
const CatchAsync = require('./../Utils/CatchAsync');

class BookController {
  
    static createBook =  CatchAsync(async (req, res, next) =>{
  
        const {title,author ,quantity,floor,section,shelf} = req.body;
        const shelfLocation = `${floor}-${section}-${shelf}`;

        const newBook = new BookClass(title,author ,parseInt(quantity),shelfLocation);

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
  
      const books = await Book.find().select('-_id');
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

module.exports = BookController;