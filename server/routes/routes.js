// routes/routes.js

const express = require('express');
const router = express.Router();
const controllers = require('../controllers/controller.js');
const passport = require('passport');

router.post('/signup', controllers.signup);
router.post('/login', controllers.validateUserlogin,
    passport.authenticate('local',{ failureFlash: true}),
    ( req, res)=> {
        res.status(200).json({ message: 'User is logged in', user: req.user});
    }
);

module.exports = router;