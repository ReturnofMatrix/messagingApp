// controller/controller.js
const db = require('../db/db');
const bcrypt = require('bcrypt');
const { body, validationResult} = require('express-validator');
const { all } = require('../routes/routes');

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
    const { email, username, password, birthday, bio, hobbies} = req.body;
    const alreadyRegistered = await db.alreadyRegistered(email);
    if(alreadyRegistered){
        return res.status(409).json({message: 'This email is already registered. use different one.'});
    }
    const hashedpass = await bcrypt.hash(password, 9);
    const data = await db.signupUser(email, username, hashedpass, birthday, bio, hobbies);
    console.log(data);
    
    return res.status(201).json({message : "user data has been inserted."});
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

exports.getMessages = async ( req, res) => {
    const receiverid = parseInt(req.params.receiverId);
    const senderid = req.user.id;
    const allMessages = await db.getAllMessages(senderid, receiverid);
    return res.status(200).json({allMessages, myId: senderid});
}

exports.message = async (req, res) => {
    const receiverid = parseInt(req.params.receiverId);
    const senderid = req.user.id;
    let text = req.body.text;
    const reply = await db.sendMessage(senderid, receiverid, text);
    const allMessages = await db.getAllMessages(senderid, receiverid);
    return res.status(201).json({allMessages, myId: senderid});
}

exports.logout = async (req, res, next) => {
    req.logout(err => {
        if(err){return next(err);}
        req.session.destroy(() => {
            res.clearCookie('conect.sid');
            return res.status(200).json({ message: 'logged out and cookie cleared successfully.'});
        });
    });
}

// i have to return all the users except the logged in user.
exports.home = async ( req, res) => {
    const id = req.user.id;
    const allUsers = await db.getUsers(id);
    res.status(200).json({ allUsers});
}

// i have to return all the info of the logged in user.
exports.profile = async ( req, res) => {
    const id = req.user.id;
    const allInfo = await db.getProfileInfo(id);
    console.log(allInfo);
    res.status(200).json({ allInfo});
}

exports.edit = async ( req, res) => {
    const id = req.user.id;
    const {editKey, editValue} = req.body;
    if(editValue.trim()){
        const edit = await db.edit(id, editKey, editValue);
    }
    const allInfo = await db.getProfileInfo(id);
    console.log(allInfo);
    res.status(200).json({ allInfo});
}