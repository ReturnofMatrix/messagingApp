// index.js
const express = require('express');
const app = express();
const routes = require('./routes/routes');
const {initialize} = require('./controllers/passport-config.js');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const flash = require('connect-flash');
const cors = require('cors');
const http = require('http');
const {setupSocket } = require('./controllers/socket.js');
const { Server } = require("socket.io");
require('dotenv').config();
const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();
global.prisma = prisma;

prisma.$connect()
  .then(() => console.log('✓ Database connected'))
  .catch(err => console.error('Database connection failed:', err));

const corsOptions = {
  origin: true, // reflect request origin
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
};

app.use(cors(corsOptions));

process.env.DATABASE_URL = process.env.NODE_ENV === 'production'
    ? process.env.NEON_DATABASE_URL
    : process.env.LOCAL_DATABASE_URL;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true
  }
});

app.set('io', io);
setupSocket(io);

app.use('/uploads', express.static('uploads'));

initialize(passport);
app.use(cookieParser());
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.use(passport.initialize());
app.use(flash());
app.use(routes);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`server is running on ${PORT}`);
});

