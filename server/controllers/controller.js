// controller/controller.js
const db = require('../db/db');
const { getRoomName } = require("./socket");
const bcrypt = require('bcrypt');
const { body, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require("../generated/prisma");
const { text } = require('express');
const prisma = new PrismaClient();

const validateUser = [
    body('email').trim().notEmpty().withMessage('email must not be empty.'),
    body('username').trim().notEmpty().withMessage('username must not be empty.'),
    body('password').trim().notEmpty().withMessage('password must not be empty.'),
    body('conpass').custom((value, {req}) => {
        return value === req.body.password
    }).withMessage('password and confirm password should match.'),
    body('birthday').notEmpty().withMessage('age must not be empty.'),
]

exports.signup = [ validateUser, async (req, res) => {

    const errors = validationResult(req);
    console.log(errors.isEmpty());
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }

    const { email, username, gender, password, birthday, bio, hobbies} = req.body;
    let profilePicUrl = req.file ? req.file.path : null;

    if(!profilePicUrl){
        if(gender === 'male'){
            profilePicUrl = 'https://res.cloudinary.com/dttkcwuw8/image/upload/v1755161523/instachat/emftojoa0fopwpockhg5.webp'
        }else if(gender === 'female'){
            profilePicUrl = 'https://res.cloudinary.com/dttkcwuw8/image/upload/v1755161603/instachat/mw47z6gmnt5314bgoiih.jpg'
        }else{
            profilePicUrl = 'https://res.cloudinary.com/dttkcwuw8/image/upload/v1755162564/instachat/oxv6ojtutewsdma1sctd.webp'
        }
    }
    console.log(gender, profilePicUrl);
    const alreadyRegistered = await db.alreadyRegistered(email);
    if(alreadyRegistered){
        return res.status(409).json({message: 'This email is already registered. use different one.'});
    }
    const hashedpass = await bcrypt.hash(password, 9);
    console.log(email, username, gender, hashedpass, birthday, bio, hobbies, profilePicUrl);
    const data = await db.signupUser(email, username, gender, hashedpass, birthday, bio, hobbies, profilePicUrl);
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

exports.login = async ( req, res) => {
    try{
        const { username, password } = req.body;
            console.log('Login attempt for:', req.body.username);
            const user = await prisma.user.findUnique({
                where: { username}
            });
            if(!user){
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            const match = await bcrypt.compare(password, user.hashedpass);
            if(!match){
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            const token = jwt.sign(
                { userId: user.id, userEmail: user.email},
                process.env.JWT_SECRET,
                { expiresIn: '1h'}
            );
            console.log('htllo;');
            return res.status(200).cookie('token', token, {httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                    maxAge: 3600000}).json({ token, loggedIn: true });
    }catch(err){
        console.error('Login error:', err);
        return res.status(500).json({ message: 'server error.'});
    }

}

exports.getMessages = async ( req, res) => {
    const receiverid = parseInt(req.params.receiverId);
    const senderid = req.user.id;
    const allMessages = await db.getAllMessages(senderid, receiverid);
    const friendName = await db.getFriendName(receiverid);
    return res.status(200).json({allMessages, friendName, myId: senderid});
}

exports.message = async (req, res) => {
    console.log("inside the server log and message.");
    const receiverid = parseInt(req.params.receiverId);
    const senderid = parseInt(req.user.id);
      const text = (req.body.text || '').trim();
    if (!text) return res.status(400).json({ message: 'Message text is required.' });
    const savedMessage = await db.saveMessageToDatabase({senderid, receiverid, text});
    const io = req.app.get('io');
    if (io) {
        io.to(getRoomName(senderid, receiverid)).emit('receiveMessage', savedMessage);
    }
    return res.status(201).json({message: savedMessage, myId: senderid});
}

exports.logout = async (req, res) => {
    res.clearCookie('token');
    res.json({message: 'logged out successfully.'});
}

// i have to return all the users except the logged in user.
exports.home = async ( req, res) => {
    const id = req.user.id;
    let messageFriends = await db.getMessageFriends(id);
    messageFriends = messageFriends.map(friends => friends.requested);
    res.status(200).json({ messageFriends});
}

// controllers/controller.js
exports.getProfilePic = async (req, res) => {
    try {
        console.log('getProfilePic user:', req.user);
        if (!req.user) return res.status(401).json({ message: 'No user in session' });
        const id = req.user.id;
        const profilePic = await db.getProfilePic(id);
        if (!profilePic) return res.status(404).json({ message: 'Profile picture not found' });
        res.status(200).json({ profilePic });
    } catch (err) {
        console.error('Error in getProfilePic:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// i have to return all the info of the logged in user.
exports.profile = async ( req, res) => {
    const id = req.user.id;
    const allProfileInfo = await db.getProfileInfo(id);
    let posts = await db.getUserPosts(id);
    posts = posts.map(post => {
        const likeCount = post.hasLikes.length;
        const userLiked = post.hasLikes.some(like => like.liked_by === id);
        const commentsCount = post.hasComments.length;
        return{
            ...post,
            likeCount,
            userLiked,
            commentsCount
        }
    });
    console.log(allProfileInfo, posts );
    res.status(200).json({ allProfileInfo, posts});
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

exports.editProfilePic = async ( req, res) => {
    const id = req.user.id;
    const profilePic = req.file.path;
    const reply = await db.editProfilePic(id, profilePic);
    res.status(200).json(reply);
}

exports.removeProfilePic = async ( req, res) => {
    const id = req.user.id;
    const gender = await db.getGender(id);
    console.log(gender);
    let profilePic;
    if(gender[0].gender === 'male'){
        profilePic = 'https://res.cloudinary.com/dttkcwuw8/image/upload/v1755161523/instachat/emftojoa0fopwpockhg5.webp'
    }else if(gender[0].gender === 'female'){
        profilePic = 'https://res.cloudinary.com/dttkcwuw8/image/upload/v1755161603/instachat/mw47z6gmnt5314bgoiih.jpg'
    }else{
        profilePic = 'https://res.cloudinary.com/dttkcwuw8/image/upload/v1755162564/instachat/oxv6ojtutewsdma1sctd.webp'
    }
    const response = await db.removeProfilePic(id, profilePic);
    res.status(200).json(response);
}

//Post i can add 1) createPost 2) getAllPosts 3) deletePost
exports.createPost = async ( req, res) => {
    const author_id = req.user.id;
    const caption = req.body.caption;
    const photo = req.file ? req.file.path : null;
    let post = 'post content is empty.';
    if(photo || caption.trim()){
        console.log(author_id, caption, photo);
        post = await db.createPost(author_id, caption, photo);
    }
    res.status(200).json({post});
}

exports.getAllPosts = async ( req, res) => {
    const author_id = req.user.id;
    const post = await db.getUserPosts(author_id);
    res.status(201).json({post});
}

exports.deletePost = async ( req, res) => {
    const id = parseInt(req.params.id);
    const author_id = req.user.id;
    const result = await db.deletePost(id, author_id);
    res.status(200).json({result});
}

// 1) createComment, 2) get All The comments on the post 
// 3) delete comment 4) if post is deleted then all its comments are also deleted.
exports.createComment = async ( req, res) => {
    const post_id = parseInt(req.params.post_id);
    const text = req.body.text;
    const created_by = req.user.id;

    const result = await db.createComment(created_by, text, post_id);
    res.status(201).json({ result })
}

exports.getAllOfPost = async ( req, res) => {
    const id = parseInt(req.params.id);
    const created_by = req.user.id;
    let post = await db.getAllOfPost(id);
    const likesCount = post.hasLikes.length;
    const userLiked = post.hasLikes.some(like => like.liked_by === created_by);
    post = {
            ...post,
            likesCount,
            userLiked,
        };
    console.log(post);
    res.status(201).json({ post })
}

exports.deleteComment = async ( req, res) => {
    const id = parseInt(req.params.id);

    const result = await db.deleteComment(id);
    res.status(201).json({ result })
}

// I can like
exports.handleLike = async ( req, res) => {
    const post_id = parseInt(req.params.post_id);
    const liked_by = req.user.id;
    const result = await db.handleLike(post_id, liked_by);
    res.status(201).json({ result });
}

exports.getStrangers = async (req, res) => {
    const id = parseInt(req.user.id);
    const result = await db.getStrangers(id);
    res.status(201).json({ result });
}

// how should i think about friends. like can a user send friend requests.
// lets say i make a new table called friends where i will list all the 
// requested, accepted friends.

// anyone can send requests and only requested person can accept or reject.
exports.addFriend = async ( req, res) => {
    const request_to = parseInt(req.params.id);
    const request_by = parseInt(req.user.id);
    const result = await db.addFriend(request_by, request_to);
    res.status(201).json({ result });
}

//accept and reject are both requests sent by someone else to us.
// so request will be to us and request by someone else.
// here while display friend list sender and receiver id will be sent.
exports.acceptFriend = async ( req, res) => {
    const id = parseInt(req.params.id);
    const result = await db.acceptFriend( id );
    res.status(201).json({ result });
}
exports.rejectFriend = async ( req, res) => {
    const id = parseInt(req.params.id);
    const result = await db.rejectFriend( id );
    res.status(201).json({ result });
}

// here request_by and request_to can be user as we want to show the
// me as sender where request is accepted in friends. and other sent request 
// to me for accept or reject.
// but pending and accepted status will determine the friend or not status.
exports.getAllFriends = async ( req, res) => {
    const id = parseInt(req.user.id);
    const allFriends = await db.getAllFriends(id);
    let onlyFriends = [], requestsToMe = [], myPendings = [];

    for(const friend of allFriends){
        if(friend.request_by === id && friend.accepted === true){
            onlyFriends.push(friend);
        }
        if(friend.request_by === id && friend.pending === true && friend.accepted === false){
            myPendings.push(friend);
        }
        if(friend.request_to === id && friend.pending === true && friend.accepted === false){
            requestsToMe.push(friend);
        }
    }
    res.status(201).json({ onlyFriends, requestsToMe, myPendings, isGuest: id === 1 });
}

// here only request which logged in user made and which have been accepted.
// only their posts are to be shown but here i have to add user posts also.
// post are ordered by created time in ascending order.
// indexPage post also contain all the likes count of the post and also
// weather the post is liked by the user or not.

exports.getIndexPage = async ( req, res) => {
    const request_by = req.user.id;
    let posts;
    if(request_by === 1){
        posts = await db.getAllPosts( );
    }else{
        posts = await db.getOnlyFriendsPost( request_by );
    }

    posts = posts.map(post => {
        const likeCount = post.hasLikes.length;
        const userLiked = post.hasLikes.some(like => like.liked_by === request_by);
        const commentsCount = post.hasComments.length;
        return{
            ...post,
            likeCount,
            userLiked,
            commentsCount
        }
    });
    const username = await db.getUsername(request_by);
    res.status(200).json({ posts, username: username[0].username });
}

exports.checkHealth = async (req, res) => {
  try {
    await global.prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'ok', db: 'connected' });
  } catch (err) {
    console.error('Health check error:', err);
    res.status(503).json({ status: 'error', db: 'not connected', error: err.message });
  }
}