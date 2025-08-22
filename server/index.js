const express = require('express');
const app = express();
const routes = require('./routes/routes');
const {initialize} = require('./controllers/passport-config.js');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
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
    allowedHeaders: ['Content-Type']
}));

app.use('/uploads', express.static('uploads'));

initialize(passport);
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.use(session({
    store: new pgSession({
        conString: process.env.DATABASE_URL,
        tableName: 'session',
        createTableIfMissing: true,
        errorLog: (err) => console.error('Session store error:', err)
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production'? 'none' : 'lax',
        maxAge: 1000 * 60 * 60 * 24
    }
}));
app.use((req, res, next) => {
    console.log('Request cookies:', req.headers.cookie);
    console.log('Session ID:', req.sessionID);
    next();
});

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(routes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`server is running on ${PORT}`);
});

