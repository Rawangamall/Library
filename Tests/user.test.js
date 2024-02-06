const UserController = require('./../Controllers/UserController');
const { User } = require('./../Models/UserModel');
const UserClass = require('./../Classes/UserClass');
const bcrypt = require('bcrypt');

jest.mock('bcrypt');
jest.mock('./../Classes/UserClass');
jest.mock('./../Models/UserModel');

describe('UserController - createUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user', async () => {
    const req = {
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

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    bcrypt.hash.mockResolvedValue('hashedPassword');

    const userClassInstanceMock = {
      firstName: 'John',
      lastName: 'Wrick',
      phoneNumber: '12345189',
      role: 'employee',
      email: 'john.doe11@example.com',
      password: 'hashedPassword',
      salary: 4000,
    };

    jest.spyOn(UserClass.prototype, 'constructor').mockReturnValue(userClassInstanceMock);
    jest.spyOn(User.prototype, 'save').mockReturnValue(userClassInstanceMock);

    await UserController.createUser(req, res);

    expect(UserClass.prototype.constructor).toHaveBeenCalledWith(
      'John',
      'Wrick',
      '12345189',
      'employee',
      'john.doe11@example.com',
      'hashedPassword',
      4000
    );
   await expect(User.prototype.save).toHaveBeenCalledWith(userClassInstanceMock);  
    expect(res.status).toHaveBeenCalledWith(201);   //not called issue

  });
})


 
describe('getUserProfile', () => {
  it('should get user data', async () => {
    const req = {
      params: {
        _id:6
      }
    }
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    User.findById.mockResolvedValue(req.params._id);
    await UserController.getUserProfile(req,res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should handle user not found', async () => {
    const req = {
      params: {
        _id:null
      }
    }
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    User.findById.mockResolvedValue(req.params._id);
    await UserController.getUserProfile(req,res);

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
    
  
const req = {
  // headers: {
  //   authorization: `Bearer ${validToken}`,
  // },
  query: {
    searchTerm: 'rawan',
    limit: 4, 
    sortField: 'createdAt', 
  },
};

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

await UserController.getAllUsers(req, res);

expect(User.find).toHaveBeenCalledTimes(1);
expect(User.find().limit).toHaveBeenCalledWith(req.query.limit);
expect(User.find().sort).toHaveBeenCalledWith(req.query.sortField); 
expect(User.find().or).toHaveBeenCalledWith(
  [{"email": {"$options": "i", "$regex": req.query.searchTerm}},
 {"role": {"$options": "i", "$regex": req.query.searchTerm}},
 {"phoneNumber": {"$options": "i", "$regex": req.query.searchTerm}}]); 

expect(res.status).toHaveBeenCalledWith(200);

});
 });

 describe("Delete use",()=>{
  it("should del the user by his id", async() => {

const req={
  params:{
    id:4
  }
}
const res={
  status:jest.fn().mockReturnThis(),
  json:jest.fn()
}

  User.findByIdAndDelete.mockResolvedValue(req.params.id);
  await UserController.delUser(req,res);

expect(res.status).toHaveBeenCalledWith(200)
   });

   it("shouldn't del user without the id", async() => {

    const req={
      params:{
        id:null
      }
    }
    const res={
      status:jest.fn().mockReturnThis(),
      json:jest.fn()
    }
    
      User.findByIdAndDelete.mockResolvedValue(req.params.id);
      await UserController.delUser(req,res);
    
    expect(res.status).toHaveBeenCalledWith(400)
       });
 });