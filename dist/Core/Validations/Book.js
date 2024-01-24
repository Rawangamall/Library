const { body} = require("express-validator");
const Book = require("./../../Models/BookModel")
const bookTypes = ['free','rental'];

exports.BookValidPOST = [
  
  body('title').isString().withMessage('Please enter the book name'),
  body('author').isString().withMessage('Please enter the author name'),
  body('quantity').isInt().withMessage('Please enter the quantity number'),
   body('type').isIn(bookTypes).withMessage('Invalid book types. Choose from: free and rental')  
  .custom(async (value, { req }) => {
      if(value === 'rental'){
         if(!parseInt(req.body.fee)){
          throw new Error('Enter a valid number for book fees');
        }
      }
  }), 
  body('floor').isString().withMessage('Please enter the floor number'),
  body('section').isString().withMessage('Please enter the section'),
  body('shelf').isString().withMessage('Please enter the shelf number')
  .custom(async (value, { req }) => {
    const { floor, section, shelf } = req.body;
    const shelfLocation = `${floor}-${section}-${shelf}`;
    const existingBook = await Book.findOne({ shelfLocation: shelfLocation });

    if (existingBook) {
      throw new Error('Shelf location already filled with another book');
    }

    return true;
  }),

];

exports.BookValidPATCH = [
    body('title').isString().optional().withMessage('Please enter the book name'),
    body('author').isString().optional().withMessage('Please enter the author name'),
    body('quantity').isInt().optional().withMessage('Please enter the quantity number'),
    body('floor').isString().optional().withMessage('Please enter the floor number'),
    body('section').isString().optional().withMessage('Please enter the section'),
    body('shelf').isString().optional().withMessage('Please enter the shelf number')
  
  ];