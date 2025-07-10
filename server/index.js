const express = require('express');
const app = express();
const routes = require('./routes/routes');
const {initialize} = require('./controllers/passport-config.js');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();
app.use(cors({
    origin: 'http://localhost:3000',
    'credentials': true
}));

initialize(passport);
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60
    }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.listen(4000, () => {
    console.log('server is running on http://localhost:4000');
});

app.use(routes);