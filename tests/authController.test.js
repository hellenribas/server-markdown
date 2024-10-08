const { register, login } = require('../controllers/authController');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const httpMocks = require('node-mocks-http');

jest.mock('../models/User');

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve registrar um novo usuário', async () => {
    const req = httpMocks.createRequest({
      body: { email: 'test@test.com', password: 'password', username: 'testuser' },
    });
    const res = httpMocks.createResponse();

    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ username: 'testuser', email: 'test@test.com' });

    await register(req, res);

    expect(res.statusCode).toBe(201);
    expect(res._getData()).toEqual('{\"message":\"Usuário criado com sucesso.\"}');
  });

  it('deve fazer login de um usuário', async () => {
    const req = httpMocks.createRequest({
      body: { email: 'test@test.com', password: 'password' },
    });
    const res = httpMocks.createResponse();

    const mockUser = {
      _id: 'userId',
      password: await bcrypt.hash('password', 10),
      username: 'testuser',
    };

    User.findOne.mockResolvedValue(mockUser);

    await login(req, res);

    expect(res.statusCode).toBe(200);
  });
});
