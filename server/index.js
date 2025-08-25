const express = require('express');
const app = express();
const routes = require('./routes/routes');
const {initialize} = require('./controllers/passport-config.js');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const flash = require('connect-flash');
const cors = require('cors');

require('dotenv').config();

process.env.DATABASE_URL = process.env.NODE_ENV === 'production'
    ? process.env.NEON_DATABASE_URL
    : process.env.LOCAL_DATABASE_URL;

app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? [
        'https://instachat-delta.vercel.app',    
        /^https:\/\/instachat-.*\.vercel\.app$/        
      ] : 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'] 
}));

app.use('/uploads', express.static('uploads'));

initialize(passport);
app.use(cookieParser());
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.use(passport.initialize());
app.use(flash());
app.use(routes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`server is running on ${PORT}`);
});

