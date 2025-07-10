// routes/routes.js

const express = require('express');
const router = express.Router();
const controllers = require('../controllers/controller.js');
const {isAuthenticated} = require('../controllers/passport-config.js');
const passport = require('passport');

router.post('/signup', controllers.signup);
router.post('/login', controllers.validateUserlogin,
    passport.authenticate('local',{ failureFlash: true}),
    ( req, res)=> {
        res.status(200).json({ loggedIn : true, message: 'User is logged in', user: req.user});
    }
);
router.get('/message/:receiverId', isAuthenticated, controllers.getMessages);
router.post('/message/:receiverId', isAuthenticated, controllers.message );
router.post('/logout',isAuthenticated, controllers.logout);
router.get('/home',isAuthenticated, controllers.home);
router.get('/profile',isAuthenticated, controllers.profile);
router.post('/edit', isAuthenticated, controllers.edit);
router.get('/status', (req, res)=> {
    res.json({isLoggedin: req.isAuthenticated()});
});

module.exports = router;