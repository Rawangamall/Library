import { Request, Response, NextFunction } from 'express';
import BorrowingOperations from '../app/Controllers/BorrowingController';
import BorrowingModel from '../app/Models/BorrowingModel';
import Book from '../app/Models/BookModel';
import util from "util";

jest.mock('../app/Models/BorrowingModel');
jest.mock('../app/Models/BookModel');
jest.mock('./../app/Controllers/BookObservable');

jest.mock('jsonwebtoken', () => ({
    __esModule: true,
    verify: jest.fn().mockResolvedValue({ id: 4 })
  }));
jest.mock('util');

beforeEach(() => {
    jest.clearAllMocks();
});
let req: Partial<Request>
let res: Partial<Response>


describe('Borrowing operation controller', () => {

    describe('Borrowing Book', () => {
    it('should perform Borrowing operation for specific user and book', async() => {
      req ={
         params:{
            id:'973e7998uhklml'
         },
         headers:{
            authorization:"Bearer token"
         },
         body:{
             dueDate:'2024-2-7'
         }
     };
     res ={
        status:jest.fn().mockReturnThis(),
        json:jest.fn()
    };
    const next:NextFunction =jest.fn()

    const bookMock = {
      availableQuantity: 4, 
      bookType: 'free', 
      save: jest.fn().mockResolvedValue({})
    };
    const borrowingMock = {
        borrower:'userid',
        book:req.params?.id,
        dueDate: '2024-02-06T22:00:00.000Z',
        returned: false,
        rentalFee: 0,
        _id:"65c48ca940ae072065d19f98",
        save: jest.fn().mockResolvedValue({})
     };

     jest.spyOn(BorrowingModel, 'create').mockReturnValue(borrowingMock);
     jest.spyOn(util, 'promisify').mockImplementation((fn) => fn);
     jest.spyOn(Book,'findById').mockResolvedValue(bookMock)
     jest.spyOn(BorrowingModel,'findOne').mockResolvedValue(null) 

    await BorrowingOperations.borrowBook(req as Request, res as Response, next)

    await expect(util.promisify).toHaveBeenCalledTimes(1);
    await expect(Book.findById).toHaveBeenCalledWith(req.params?.id)
    await expect(BorrowingModel.create).toHaveBeenCalledTimes(1)
    await expect(borrowingMock.save).toHaveBeenCalledTimes(1)
    expect(bookMock.availableQuantity).toBe(3)  //decres by 1
    await expect(bookMock.save).toHaveBeenCalledTimes(1)
   expect(res.status).toHaveBeenCalledWith(201)

});

it('should\'t perform borrow on outstock book ', async() => {
     req ={
        params:{
           id:'973e7998uhklml'
        },
        headers:{
           authorization:"Bearer token"
        },
        body:{
            dueDate:'2024-2-7'
        }
    };
     res ={
        status:jest.fn().mockReturnThis(),
        json:jest.fn()
    };
    const next =jest.fn()

    const bookMock = {
      availableQuantity: 0, 
      bookType: 'free', 
      save: jest.fn().mockResolvedValue({})
    };

    jest.spyOn(util, 'promisify').mockImplementation((fn) => fn);
    jest.spyOn(Book,'findById').mockResolvedValue(bookMock)

    await BorrowingOperations.borrowBook(req as Request, res as Response, next)

    await expect(util.promisify).toHaveBeenCalledTimes(1);
    await expect(Book.findById).toHaveBeenCalledWith(req.params?.id)
   expect(res.status).toHaveBeenCalledWith(400)
   expect(res.json).toHaveBeenCalledWith('Book Stock out, check it later!')
});

it('shouldn\'t perform Borrowing operation twice if not returned yet', async() => {
     req ={
        params:{
           id:'973e7998uhklml'
        },
        headers:{
           authorization:"Bearer token"
        },
        body:{
            dueDate:'2024-2-7'
        }
    };
     res ={
        status:jest.fn().mockReturnThis(),
        json:jest.fn()
    };
    const next =jest.fn()

    const bookMock = {
      availableQuantity: 4, 
      bookType: 'free', 
      save: jest.fn().mockResolvedValue({})
    };
     

        jest.spyOn(util, 'promisify').mockImplementation((fn) => fn);
    jest.spyOn(Book,'findById').mockResolvedValue(bookMock)
    jest.spyOn(BorrowingModel,'findOne').mockResolvedValue({operation:"there's one"}) 

    await BorrowingOperations.borrowBook(req as Request, res as Response, next)

    await expect(util.promisify).toHaveBeenCalledTimes(1);
    await expect(Book.findById).toHaveBeenCalledWith(req.params?.id)
   expect(res.status).toHaveBeenCalledWith(400)
   expect(res.json).toHaveBeenCalledWith('You\'re already borrowed that book!')

});
})

describe('Retrurn Book', () => {
    it('should return a book', async() => {
         req ={
            params:{
               id:'973e7998uhklml'
            },
            headers:{
               authorization:"Bearer token"
            }
        };
         res ={
            status:jest.fn().mockReturnThis(),
            json:jest.fn()
        };
        const next =jest.fn()

        const bookMock = {
            availableQuantity: 4, 
            bookType: 'free', 
            save: jest.fn().mockResolvedValue({})
          };
        const operationMock={
            id:"test",
            returned:false,
            save: jest.fn().mockResolvedValue({})
        }
      
          jest.spyOn(util, 'promisify').mockImplementation((fn) => fn);
          jest.spyOn(BorrowingModel,'findOne').mockResolvedValue(operationMock);
          jest.spyOn(Book,'findById').mockResolvedValue(bookMock);

          await BorrowingOperations.returnBook(req as Request, res as Response, next)

          await expect(util.promisify).toHaveBeenCalledTimes(1);
          await expect(BorrowingModel.findOne).toHaveBeenCalledTimes(1)
          await expect(Book.findById).toHaveBeenCalledWith(req.params?.id)
          await expect(operationMock.save).toHaveBeenCalledTimes(1);
          await expect(bookMock.save).toHaveBeenCalledTimes(1);
          expect(operationMock.returned).toBe(true)  
          expect(bookMock.availableQuantity).toBe(5)  //inc by 1
          expect(res.status).toHaveBeenCalledWith(200)
    });

    it('shouldn\'t return a book twice', async() => {
         req ={
            params:{
               id:'973e7998uhklml'
            },
            headers:{
               authorization:"Bearer token"
            }
        };
         res ={
            status:jest.fn().mockReturnThis(),
            json:jest.fn()
        };
        const next =jest.fn()

        const bookMock = {
            availableQuantity: 4, 
            bookType: 'free', 
            save: jest.fn().mockResolvedValue({})
          };
        const operationMock={
            id:"test",
            returned:true,
            save: jest.fn().mockResolvedValue({})
        }
      
          jest.spyOn(util, 'promisify').mockImplementation((fn) => fn);
          jest.spyOn(BorrowingModel,'findOne').mockResolvedValue(operationMock);
          jest.spyOn(Book,'findById').mockResolvedValue(bookMock);

          await BorrowingOperations.returnBook(req as Request, res as Response, next)

          await expect(util.promisify).toHaveBeenCalledTimes(1);
          await expect(BorrowingModel.findOne).toHaveBeenCalledTimes(1)
          await expect(Book.findById).toHaveBeenCalledWith(req.params?.id)
          expect(res.status).toHaveBeenCalledWith(400)
          expect(res.json).toHaveBeenCalledWith({message:"You didn't borrow this book or already returned :)"})
    });
})
      
});
