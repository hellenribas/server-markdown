const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const connectDB = require('./config/db');
const documentRoutes = require('./routes/documentRoute');
const userRoutes = require('./routes/userRoute');
const protectedRoutes = require('./routes/protectedRoute');
const { handleSocket } = require('./utils/socketHandler');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');
require('dotenv').config();

connectDB();

const app = express();
const server = http.createServer(app);
const allowedOrigins = '*';

app.use(cors({
  origin: allowedOrigins, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
}));

app.options('*', cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
}));

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
});

app.use(express.json());
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use('/api/auth', userRoutes);
app.use('/api/documents', documentRoutes);

io.on('connection', (socket) => handleSocket(socket, io));

app.use(errorHandler);

module.exports = (req, res) => {
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  app(req, res); 
};

if (process.env.NODE_ENV !== 'production') {
  server.listen(4000, () => {
    console.log('Servidor rodando na porta 4000');
  });
}
