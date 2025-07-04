// controller/controller.js
const db = require('../db/db');
const bcrypt = require('bcrypt');
const { body, validationResult} = require('express-validator');

const validateUser = [
    body('email').trim().notEmpty().withMessage('email must not be empty.'),
    body('username').trim().notEmpty().withMessage('username must not be empty.'),
    body('password').trim().notEmpty().withMessage('password must not be empty.'),
    body('conpass').custom((value, {req}) => {
        return value === req.body.password
    }).withMessage('password and confirm password should match.'),
    // body('age').trim().notEmpty().message('age must not be empty.'),
]

exports.signup = [ validateUser, async (req, res) => {

    const errors = validationResult(req);
    console.log(errors.isEmpty());
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }
    const { email, username, password} = req.body;
    const hashedpass = await bcrypt.hash(password, 19);
    const data = await db.signupUser(email, username, hashedpass);
    console.log(data);
    
    return res.status(200).json({message : "user data has been inserted."});
}]

exports.validateUserlogin = [ 
    body('username').trim().notEmpty().withMessage('username must not be empty.'),
    body('password').trim().notEmpty().withMessage('password must not be empty.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array()})
        }
        next();
    }
]