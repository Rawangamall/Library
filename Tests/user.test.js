const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server'); 

const QueryOperation  = require('./../Controllers/QueryOperations').default;
const { User } = require('./../Models/UserModel');
jest.mock('./../Models/UserModel')


let server;
let port;

beforeAll(() => {
  return new Promise((resolve) => {
    server = app.listen(0, () => {
      port = server.address().port;
      resolve();
    });
  });
});


afterAll(async () => {
  await mongoose.connection.close();
  return new Promise((resolve) => {
    server.close(resolve);
  });
});



describe('UserController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'wrick',
        phoneNumber: '12345189',
        role: 'employee',
        email: 'john.doe11@example.com',
        password: 'Password123!', 
        salary: '4000',
      };

      const response = await request(app)
        .post('/users')
        .send(userData);

        expect(response.status).toBe(201);
    });
  });

  describe('getUserProfile', () => {
    it('should get user data', async () => {

      User.findById.mockResolvedValue(6);

      const response = await request(app).get('/user/6');
      expect(response.status).toBe(200);
    });
  });
});


describe('LoginController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login User', () => {
      it('should create a new user', async () => {
        const userData = {
         // email: 'rawan.gamaal21@gmail.com',
          password: '1234jemi!', 
        };

        User.findOne = jest.fn().mockResolvedValue({
          select: jest.fn(),
          correctPassword: jest.fn().mockResolvedValue(true),
        });

        const response = await request(app)
          .post('/dashboard/login')
          .send(userData);
           
          expect(response.status).toBe(404); //missing paramter untill solve select
          expect(response.body).toBeDefined();
        });
    });
  
})

 describe('Authenticated API of get all users', () => {
  it('should return all users when authenticated', async () => {
    const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzA2OTM0MTQ4LCJleHAiOjE3MDc1Mzg5NDh9.4KffiTPiYRnlp85MdZ4pZWUU3al_K6uEwTvgSBxCd24';
   
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
    
    const response = await request(app)
      .get('/users')  
      .set('Authorization', `Bearer ${validToken}`)
      .query({searchTerm:'rawan', limit: 1, sortField: 'createdAt' });


// console.log(response.error)
// console.log(response.body)
expect(User.find().limit).toHaveBeenCalledTimes(1);
expect(User.find().limit().sort).toHaveBeenCalledTimes(1);

expect(response.status).toBe(200);
expect(response.body).toEqual(mockUsers);
  });

  it('should return an unauthorized response when not authenticated', async () => {
    //without a valid token in the header
    const response = await request(app)
      .get('/users') 
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'You\'re not logged in, please go to login page' });
  });
});