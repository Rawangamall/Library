import { Request, Response, NextFunction } from 'express';

const LoginController = require('./../app/Controllers/LoginController');
const TwilioService = require('./../app/Utils/SMS_service')
const AppError = require('./../app/Utils/appError');
const { User } = require('./../app/Models/UserModel');
const bcrypt = require('bcrypt');

jest.mock('bcrypt');
jest.mock('./../app/Models/UserModel');
jest.mock('./../app/Utils/SMS_service', () => ({
  sendSMS: jest.fn().mockReturnValue(true), 
  verifyUser: jest.fn().mockReturnValue('approved')
}));
let req: Partial<Request>
let res: Partial<Response>


 describe('LoginController', () => {
   beforeEach(() => {
     jest.clearAllMocks();
   });


   describe('login User', () => {
       it('shouldn\'t be able to login without email or pass', async () => {
          req = {
          body: {
            password: 'pass1234', 
          }};
        
         res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };

       const next =jest.fn()

        await LoginController.userAuth.login(req as Request, res as Response, next,next);
       const AppErrorInstance = next.mock.calls[0][0];

        expect(AppErrorInstance.statusCode).toBe(404); //missing paramter untill

        });

   it('shouldn\'t be able to login with Incorrect email or password or user not found', async () => {

           req = {
           body: {
            email:'rawan@test.com',
             password: 'pass1234'
           },
         };
         
          res = {
           status: jest.fn().mockReturnThis(),
           json: jest.fn(),
         };
 
        const next =jest.fn()
        jest.spyOn(User, 'findOne').mockReturnValue({
          select: jest.fn().mockResolvedValue(null),  //user not exist
        correctPassword: jest.fn().mockResolvedValue(false)  //the schema method to be access with the objet
        });


         await LoginController.userAuth.login(req as Request, res as Response, next,next); 
         expect(User.findOne().select).toHaveBeenCalledTimes(1);
         const AppErrorInstance = next.mock.calls[0][0];
         expect(AppErrorInstance.statusCode).toBe(401); //Incorrect login data
 
         });

it('shouldbe able to login', async () => {

             req = {
             body: {
              email:'rawan@test.com',
               password: 'pass1234'
             },
           };
           
            res = {
             status: jest.fn().mockReturnThis(),
             json: jest.fn(),
           };
        
          const next =jest.fn()
          jest.spyOn(User, 'findOne').mockReturnValue({
            select: jest.fn().mockReturnValue({
                password:req.body.password,
                correctPassword: jest.fn().mockReturnValue(true)
            }),
          });

          await LoginController.userAuth.login(req as Request, res as Response, next,next); 
          await expect(User.findOne().select).toHaveBeenCalledTimes(1);
           expect(res.status).toHaveBeenCalledWith(200);
        
           });
     });

  describe('Forget password',()=>{
     it('should be send the otp code when user exist',async()=>{
          req = {
          body:{
            email:'rawan@test.com'
          }}

         res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        };

         jest.spyOn(User,'findOne').mockResolvedValue({
          email: 'rawan@test.com',
          phoneNumber: '1234567890',
        })

        bcrypt.hash.mockResolvedValue('hashedPassword');
        await LoginController.userAuth.forgetpassword(req,res);

        expect(User.findOne).toHaveBeenCalledWith( {email:req.body.email });
    await  expect(TwilioService.sendSMS).toHaveBeenCalledWith('1234567890');
        expect(res.status).toHaveBeenCalledWith(200);
     })    
  })

  
  describe('Reset password',()=>{
    it('should be reset with new password',async()=>{
         req = {
         body:{
           code:'708527',
           phone:'1234567890',
           password:'newPassword',
           confirmPassword:'newPassword'
         }}

        res = {
         status: jest.fn().mockReturnThis(),
         json: jest.fn()
       };
       const next =jest.fn()

      

        jest.spyOn(User,'findOne').mockResolvedValue({
         email: 'rawan@test.com',
         phoneNumber: '1234567890',
         password:'oldpassword'
       })


       bcrypt.hashSync.mockReturnValue('hashedPassword');
       const user = {
        email: 'rawan@test.com',
        phoneNumber: '1234567890',
        password: 'hashedPassword',
        save: jest.fn().mockResolvedValue({})
      };
      
      jest.spyOn(User, 'findOne').mockResolvedValue(user);
       jest.spyOn(user, 'save').mockResolvedValue({});

       await LoginController.userAuth.resetpassword(req as Request, res as Response, next);

       expect(User.findOne).toHaveBeenCalledWith( {phoneNumber:req.body.phone });
   await  expect(TwilioService.verifyUser).toHaveReturnedWith('approved');
   await expect(user.save).toHaveBeenCalledTimes(1);  
       expect(res.status).toHaveBeenCalledWith(200);
    })    
 })
 
});
 
  

