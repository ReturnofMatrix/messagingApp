const express = require('express');
const app = express();
const routes = require('./routes/routes');
const {initialize} = require('./controllers/passport-config.js');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

process.env.DATABASE_URL = process.env.NODE_ENV === 'production'
    ? process.env.NEON_DATABASE_URL
    : process.env.LOCAL_DATABASE_URL;

app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? 'instachat-delta.vercel.app' : 'http://localhost:3000',
    credentials: true
}));

app.use('/uploads', express.static('uploads'));

initialize(passport);
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60
    }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(routes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`server is running on ${PORT}`);
});

