const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server'); 


const { User } = require('./../Models/UserModel');
jest.mock('./../Models/UserModel')

let server; 

beforeAll(() => {
  return new Promise((resolve) => {
    server = app.listen(8081, resolve);
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
          email: 'rawan.gamaal21@gmail.com',
          password: '1234jemi!', 
        };

        User.findOne = jest.fn().mockResolvedValue({
          select: jest.fn(),
          correctPassword: jest.fn().mockResolvedValue(true),
        });
        
        const response = await request(app)
          .post('/dashboard/login')
          .send(userData);
            console.log(response.text)  
          expect(response.status).toBe(200);
      });
    });
  
})
