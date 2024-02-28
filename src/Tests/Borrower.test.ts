import { Request, Response, NextFunction } from 'express';
import BorrowerController from './../app/Controllers/BorrowerController';
import util from "util";

import { Borrower } from './../app/Models/UserModel';
import Book from './../app/Models/BookModel';
import Operations from './../app/Models/BorrowingModel';

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

describe('BorrowerController', () => {
    
    describe('show Borrower profile', () => {
        
      it('should show borrower profile within id', async () => {
         req= { params: { id: '4' } };
         res= { json: jest.fn(), status: jest.fn().mockReturnThis() };
        const next: NextFunction = jest.fn();
  
        const mockBorrower = {
          id: 4,
          email: 'rawan@test.com'
        };
  
        jest.spyOn(Borrower, 'findById').mockResolvedValue(mockBorrower);
  
        await BorrowerController.getBorrowerProfile(req as Request, res as Response, next);
  
        await expect(Borrower.findById).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockBorrower);
      });
        it("should show borrower profile within id",async ()=>{
             req={
                params:{
                    id:'4'
                }
            };
             res={
                status:jest.fn().mockReturnThis(),
                json:jest.fn()
            };
            const next=jest.fn();

           jest.spyOn(Borrower,'findById').mockResolvedValue(null);
            await BorrowerController.getBorrowerProfile(req as Request, res as Response, next);

            await expect(Borrower.findById).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Borrower not found' });
        })
    });

    describe("get all Borrowers",()=>{
        it("should show borrowers ",async ()=>{
             req={
                query:{
                    searchTerm:"test",
                     sortField:"CreatedAt",
                      limit:'10'
                }
            };
             res={
                status:jest.fn().mockReturnThis(),
                json:jest.fn()
            };
            const next=jest.fn();

            const mockBorrowers = [
                {"_id":2,"email":"rawan.gamaal21@gmail.com","phoneNumber":"01022887277","hiringDate":"2024-01-21T04:16:52.670Z","salary":3500,"firstName":"Rawan","lastName":"Gamal","image":"default.jpg","role":"admin","active":true,"createdAt":"2024-01-21T04:17:44.653Z","updatedAt":"2024-01-31T04:20:34.707Z","__v":0,"phoneVerify":true},
                {"phoneVerify":false,"_id":4,"email":"youmna.gamaal@gmail.com","phoneNumber":"01022887100","hiringDate":"2024-01-22T01:13:50.002Z","salary":4500,"firstName":"youmna","lastName":"Gamal","image":"default.jpg","role":"manager","active":true,"createdAt":"2024-01-22T01:13:55.912Z","updatedAt":"2024-01-22T01:13:55.912Z","__v":0}
              ];
             
              jest.spyOn(Borrower, 'find').mockReturnValue({
                or: jest.fn().mockReturnThis(), 
                sort: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockBorrowers)
              });

            await BorrowerController.getAllBorrowers(req as Request, res as Response, next);

            expect(Borrower.find).toHaveBeenCalledTimes(1);
            expect(Borrower.find().limit).toHaveBeenCalledWith(parseInt((req.query?.limit || '5').toString()));
            expect(Borrower.find().sort).toHaveBeenCalledWith(req.query?.sortField); 
            expect(Borrower.find().or).toHaveBeenCalledWith(
              [{"email": {"$options": "i", "$regex": req.query?.searchTerm}},
             {"phoneNumber": {"$options": "i", "$regex": req.query?.searchTerm}}]); 
            
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockBorrowers)
        })
    });

    describe("update Borrower",()=>{
        it("should update Borrower ",async ()=>{
             req={
                params:{
                    id:'4'
                },
                body:{
                  firstName:'new name'
                }
            };
             res={
                status:jest.fn().mockReturnThis(),
                json:jest.fn()
            };
            const next=jest.fn();
            jest.spyOn(Borrower,"findByIdAndUpdate").mockResolvedValue(req.params?.id)

            await BorrowerController.updateBorrower(req as Request, res as Response, next);
            expect(Borrower.findByIdAndUpdate).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(200)
        })
    });

    describe("delete Borrower",()=>{
        it("should delete Borrower since he returned all books ",async ()=>{
             req={
                params:{
                    id:'4'
                }
            };
             res={
                status:jest.fn().mockReturnThis(),
                json:jest.fn()
            };
            const next=jest.fn();

            jest.spyOn(Borrower,'findById').mockResolvedValue(req.params?.id)
            jest.spyOn(Operations,'find').mockResolvedValue([])
            jest.spyOn(Borrower,'findByIdAndDelete').mockResolvedValue(req.params?.id)

            await BorrowerController.deleteBorrower(req as Request, res as Response, next)

           await expect(Borrower.findById).toHaveBeenCalledTimes(1)
           await expect(Operations.find).toHaveBeenCalledTimes(1)
           await expect(Borrower.findByIdAndDelete).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(200)
        })

        it("shouldn\'t delete Borrower since he not returned all books yet",async ()=>{
             req={
                params:{
                    id:'4'
                }
            };
             res={
                status:jest.fn().mockReturnThis(),
                json:jest.fn()
            };
            const next=jest.fn();
            const operationsMock =[
                {_id:1,book:"first"},
                {_id:2,book:"second"}]
            

            jest.spyOn(Borrower,'findById').mockResolvedValue(req.params?.id)
            jest.spyOn(Operations,'find').mockResolvedValue(operationsMock)
            jest.spyOn(Book, 'find').mockResolvedValueOnce([{book:"first"},{book:"second"}]);

            await BorrowerController.deleteBorrower(req as Request,res as Response,next)

           await expect(Borrower.findById).toHaveBeenCalledTimes(1)
           await expect(Operations.find).toHaveBeenCalledTimes(1)
           await expect(Book.find).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                message: "Borrower has books that haven't been returned",
                operationIds: [1, 2],
                borrowedBooks: [{book:"first"},{book:"second"}]});
        })
    });

    describe('add Book to Wishlist', () => {
        it('should perform adding book to wishlist of specific borrower', async() => {
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

        const BorrowerMock={
            id:4,
            wishList:['9089893209','908903uh3'],  //book ids
            save: jest.fn().mockResolvedValue({})
        }
        jest.spyOn(util, 'promisify').mockImplementation((fn) => fn);
        jest.spyOn(Book,'findById').mockResolvedValue(req.params?.id)
        jest.spyOn(Borrower,'findById').mockResolvedValue(BorrowerMock)

        await BorrowerController.addWishBook(req as Request,res as Response,next)

        await expect(util.promisify).toHaveBeenCalledTimes(1);
        await expect(Book.findById).toHaveBeenCalledTimes(1)
        await expect(Borrower.findById).toHaveBeenCalledTimes(1)
         expect(res.status).toHaveBeenCalledWith(200)
       })

       it('shouldn\'t add same book to wishlist twice', async() => {
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

        const BorrowerMock={
            id:4,
            wishList:['973e7998uhklml','908903uh3'],  //book ids
            save: jest.fn().mockResolvedValue({})
        }
        jest.spyOn(util, 'promisify').mockImplementation((fn) => fn);
        jest.spyOn(Book,'findById').mockResolvedValue(req.params?.id)
        jest.spyOn(Borrower,'findById').mockResolvedValue(BorrowerMock)

        await BorrowerController.addWishBook(req as Request,res as Response,next)

        await expect(util.promisify).toHaveBeenCalledTimes(1);
        await expect(Book.findById).toHaveBeenCalledTimes(1)
        await expect(Borrower.findById).toHaveBeenCalledTimes(1)
         expect(res.status).toHaveBeenCalledWith(400)
         expect(res.json).toHaveBeenCalledWith({message:'Book is already in ur wishlist'})
       })
   });
})