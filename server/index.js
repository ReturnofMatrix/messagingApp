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

const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://instachat-delta.vercel.app', /^https:\/\/instachat-.*\.vercel\.app$/]
  : ['http://localhost:3000'];

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    const isAllowed = allowedOrigins.some((allowed) =>
      allowed instanceof RegExp ? allowed.test(origin) : allowed === origin
    );
    callback(isAllowed ? null : new Error('Not allowed by CORS'), isAllowed);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

process.env.DATABASE_URL = process.env.NODE_ENV === 'production'
    ? process.env.NEON_DATABASE_URL
    : process.env.LOCAL_DATABASE_URL;

const server = http.createServer(app);
const io = new Server(server, {
        cors: {
        origin: process.env.NODE_ENV === 'production'
            ? [
            'https://instachat-delta.vercel.app',    
            /^https:\/\/instachat-.*\.vercel\.app$/        
        ] : 'http://localhost:3000',
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

