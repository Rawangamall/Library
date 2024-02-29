import { Request, Response, NextFunction } from 'express';
import UserController from './../app/Controllers/UserController';
import { User } from './../app/Models/UserModel';
import UserClass from './../app/Classes/UserClass';
const bcrypt = require('bcrypt');

jest.mock('bcrypt');
jest.mock('./../app/Classes/UserClass');
jest.mock('./../app/Models/UserModel');

  beforeEach(() => {
    jest.clearAllMocks();
  });
  let req: Partial<Request>
  let res: Partial<Response>
  
describe('UserController - createUser', () => {   

  it('should create a new user', async () => {
     req = {
      body: {
        firstName: 'John',
        lastName: 'Wrick',
        phoneNumber: '12345189',
        role: 'employee',
        email: 'john.doe11@example.com',
        password: 'password1234!',
        salary: 4000,
      },
    };

     res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next: NextFunction = jest.fn();

    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

    const userClassInstanceMock= {
      firstName: 'John',
      lastName: 'Wrick',
      phoneNumber: '12345189',
      role: 'employee',
      email: 'john.doe11@example.com',
      password: 'hashedPassword',
      salary: 4000,
    };
    
    jest.spyOn(UserClass.prototype, 'constructor' as never).mockReturnValue(userClassInstanceMock as never); //hateful never error
    jest.spyOn(User.prototype, 'save').mockReturnValue(userClassInstanceMock);

    await UserController.createUser(req as Request, res as Response, next);

    expect(UserClass.prototype.constructor).toHaveBeenCalledWith(
      'John',
      'Wrick',
      '12345189',
      'employee',
      'john.doe11@example.com',
      'hashedPassword',
      4000
    );
    expect(UserClass.prototype.constructor).toHaveReturnedWith(userClassInstanceMock)
   await expect(User.prototype.save).toHaveBeenCalledWith(userClassInstanceMock);  
    expect(res.status).toHaveBeenCalledWith(201);   //not called issue

  });
})


 
describe('getUserProfile', () => {
  it('should get user data', async () => {
     req = {
      params: {
        _id:'6'
      }
    }
    
     res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next: NextFunction = jest.fn();


    User.findById.mockResolvedValue(req.params?._id);
    await UserController.getUserProfile(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should handle user not found', async () => {
     req = {
      params: {
        _id:'4'
      }
    }
    
     res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next: NextFunction = jest.fn();

    User.findById.mockResolvedValue(null);
    await UserController.getUserProfile(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

});


  describe('get all users', () => {
   it('should return all users when authenticated', async () => {
    // const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzA2OTM0MTQ4LCJleHAiOjE3MDc1Mzg5NDh9.4KffiTPiYRnlp85MdZ4pZWUU3al_K6uEwTvgSBxCd24';
   
     const mockUsers = [
       {"_id":2,"email":"rawan.gamaal21@gmail.com","phoneNumber":"01022887277","hiringDate":"2024-01-21T04:16:52.670Z","salary":3500,"firstName":"Rawan","lastName":"Gamal","image":"default.jpg","role":"admin","active":true,"createdAt":"2024-01-21T04:17:44.653Z","updatedAt":"2024-01-31T04:20:34.707Z","__v":0,"phoneVerify":true},
       {"phoneVerify":false,"_id":4,"email":"youmna.gamaal@gmail.com","phoneNumber":"01022887100","hiringDate":"2024-01-22T01:13:50.002Z","salary":4500,"firstName":"youmna","lastName":"Gamal","image":"default.jpg","role":"manager","active":true,"createdAt":"2024-01-22T01:13:55.912Z","updatedAt":"2024-01-22T01:13:55.912Z","__v":0}
     ];
    
     jest.spyOn(User, 'find').mockReturnValue({
       or: jest.fn().mockReturnThis(), 
       sort: jest.fn().mockReturnThis(),
       limit: jest.fn().mockReturnThis(),
       exec: jest.fn().mockResolvedValue(mockUsers)
     });
    
  
 req = {
  // headers: {
  //   authorization: `Bearer ${validToken}`,
  // },
  query: {
    searchTerm: 'rawan',
    limit: '4' , 
    sortField: 'createdAt', 
  },
};

 res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
const next: NextFunction = jest.fn();

await UserController.getAllUsers(req as Request, res as Response, next);

expect(User.find).toHaveBeenCalledTimes(1);
expect(User.find().limit).toHaveBeenCalledWith(parseInt((req.query?.limit || '5').toString()));
expect(User.find().sort).toHaveBeenCalledWith(req.query?.sortField); 
expect(User.find().or).toHaveBeenCalledWith(
  [{"email": {"$options": "i", "$regex": req.query?.searchTerm}},
 {"role": {"$options": "i", "$regex": req.query?.searchTerm}},
 {"phoneNumber": {"$options": "i", "$regex": req.query?.searchTerm}}]); 

expect(res.status).toHaveBeenCalledWith(200);

});
 });

 describe("Delete use",()=>{
  it("should del the user by his id", async() => {

 req={
  params:{
    id:'4'
  }
}
 res={
  status:jest.fn().mockReturnThis(),
  json:jest.fn()
}
const next: NextFunction = jest.fn();

  User.findByIdAndDelete.mockResolvedValue(req.params?.id);
  await UserController.delUser(req as Request, res as Response, next);

expect(res.status).toHaveBeenCalledWith(200)
   });

   it("shouldn't del user without the id", async() => {

     req={
      params:{
        id:'4'
      }
    }
     res={
      status:jest.fn().mockReturnThis(),
      json:jest.fn()
    }
    const next: NextFunction = jest.fn();

      User.findByIdAndDelete.mockResolvedValue(null);
      await UserController.delUser(req as Request, res as Response, next);
    
    expect(res.status).toHaveBeenCalledWith(400)
       });

 });

 describe('Update user',()=>{
  it("should update user", async() => {

     req ={
      params:{
        _id:'4'
      },
      body:{
        firstName:'new name'
      }
    }

     res={
      status:jest.fn().mockReturnThis(),
      json:jest.fn()
    }
    const next: NextFunction = jest.fn();


    jest.spyOn(User,"findByIdAndUpdate").mockResolvedValue(req.params?._id)

    await UserController.UpdateUser(req as Request, res as Response, next)
    expect(User.findByIdAndUpdate).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(200)
})

 })