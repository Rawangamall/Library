import * as JWT from 'jsonwebtoken';
import { promisify } from 'util';
import moment from 'moment';
import Stripe from 'stripe';
import QueryBuilder from './QueryBuilder';
import ObserverManager from './BookObservable';

import BookBorrowing from './../Models/BorrowingModel';
import Book from './../Models/BookModel';
import CatchAsync from '../Utils/CatchAsync';

const Stripe_SecretKey=process.env.Stripe_SecretKey  as string
const stripe = new Stripe(Stripe_SecretKey);

class BorrowingOperations {

  static borrowBook = CatchAsync(async (req, res, next) => {
    const bookId = req.params.id;
    const token = req.headers.authorization?.split(' ')[1];
    let session 

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
  
       session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                      name: `${book.title}`, 
                      description: `the ${book.title} written by ${book.author}`, 
                  },
                    unit_amount: rentAmount*100, // in cents
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
        metadata: {
          userId: userId,
          bookId: bookId,
          dueDate:dueDate,
          Amount:rentAmount
      },
    });

    }

    res.status(201).json({data: borrowingResult , sessionId: session?.id });

  });

  static chargeForBorrow = CatchAsync(async(req,res,next) =>{
    const payload = req.rawBody as string | Buffer
    const sig = req.headers['stripe-signature'];

    // Verify webhook signature
    if (!sig) {
      return res.status(400).json({ error: 'Stripe signature missing in request headers' });
  }

  const event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET as string);

  if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      const userId = session.metadata?.userId;
      const bookId = session.metadata?.bookId;
      const rentAmount = parseInt(session.metadata?.Amount as string);
      const dueDate = session.metadata?.dueDate

      if (!userId || !bookId || !rentAmount) {
          return res.status(400).json({ error: 'Missing metadata in session object' });
      }

      const book = await Book.findById(bookId);
      if (!book) {
          return res.status(404).json({ error: 'Book not found' });
      }
    
        const paymentIntent = await stripe.paymentIntents.create({
            amount: rentAmount * 100, 
            currency: 'usd',
            description: `Rent for ${book.title}`,
            customer: userId, 
        });

        await BookBorrowing.create({ borrower: userId, book: bookId, rentalFee: rentAmount,dueDate:dueDate });
    
        // Update book availability and sales count
        book.availableQuantity -= 1;
        book.sales += 1;
        await book.save();

        res.status(200).json({ message: 'Payment processed successfully' });
    }
    res.status(400).json({ message: 'Event type not handled' });

  });

  static returnBook = CatchAsync(async (req, res, next) => {

    const bookId = req.params.id;
    const token = req.headers.authorization?.split(' ')[1];

    if(!token){
        return res.status(401).json('You\'re not logged in, please go to login page');
     }

     type VerifyCallback = (token: string, secret: string) => Promise<any>;

     const decoded = await (promisify(JWT.verify) as VerifyCallback)(token, process.env.JWT_SECRET as string);
     const operation = await BookBorrowing.findOne({book:bookId,borrower:decoded.id,returned:false})
     const book = await Book.findById(bookId)

     if(!operation || operation.returned){
      return res.status(400).json({message:"You didn't borrow this book or already returned :)"})
     }

     operation.returned = true
     book.availableQuantity +=1;

     await operation.save();
     await book.save();

     ObserverManager.notifyObservers(bookId,true)

     res.status(200).json({message:"The book is returned"})
  })

  static OperationList = CatchAsync(async (req,res,next)=>{
    const filter = req.query.filter as unknown as boolean;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10 as number;
    const sort = req.query.sort as string;
    
    const operationsQuery = new QueryBuilder(BookBorrowing) 
    .limit(limit)
    .sort(sort)
    .filterReturned(filter)
    .populate('borrower', 'email')
    .populate('book');

    const operations = await operationsQuery.build();
    if(operations.length === 0){
        return res.status(404).json({message:'There\'s no operation'});
    }
    res.status(200).json(operations)
  })

}


export default BorrowingOperations;
