const express = require('express');
const app = express();
const routes = require('./routes/routes');
const initializePassport = require('./controllers/passport-config.js');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

initializePassport(passport);
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.use(session({
    secret: 'superSecretKey',
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

app.listen(3000, () => {
    console.log('server is running on http://localhost:3000');
});

app.use(routes);