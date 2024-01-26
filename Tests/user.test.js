const request = require('supertest');
const app = require('../server'); 

const { User } = require('./../Models/UserModel');

jest.mock('./../Models/UserModel');

let server; 

beforeAll(() => {
  server = app.listen(); 
});

afterAll((done) => {
  server.close(done); 
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