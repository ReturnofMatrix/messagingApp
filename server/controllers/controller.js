// controller/controller.js
const db = require('../db/db');
const bcrypt = require('bcrypt');
const { body, validationResult} = require('express-validator');
// const { all } = require('../routes/routes');

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
    const profilePic = req.file?`/uploads/${req.file.filename}`: null;

    const alreadyRegistered = await db.alreadyRegistered(email);
    if(alreadyRegistered){
        return res.status(409).json({message: 'This email is already registered. use different one.'});
    }
    const hashedpass = await bcrypt.hash(password, 9);
    const data = await db.signupUser(email, username, hashedpass, birthday, bio, hobbies, profilePic);
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
    let messageFriends = await db.getMessageFriends(id);
    messageFriends = messageFriends.map(friends => friends.requested);
    res.status(200).json({ messageFriends});
}

exports.getProfilePic = async (req, res) => {
    const id = req.user.id;
    let profilePic = await db.getProfilePic(id);
    res.status(200).json({ profilePic });
}

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
    const profilePic = req.file? `/uploads/${req.file.filename}`: null;
    const reply = await db.editProfilePic(id, profilePic);
    res.status(200).json(reply);
}

//Post i can add 1) createPost 2) getAllPosts 3) deletePost
exports.createPost = async ( req, res) => {
    const author_id = req.user.id;
    const content = req.body.content;
    let post = 'post content is empty.';
    if(content.trim()){
        post = await db.createPost(author_id, content);
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

exports.getAllComments = async ( req, res) => {
    const id = parseInt(req.params.id);
    const created_by = req.user.id;
    let post = await db.getAllComments(id);
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

exports.getStrangers = async (req, res) => {
    const id = parseInt(req.user.id);
    const result = await db.getStrangers(id);
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
    res.status(201).json({ onlyFriends, requestsToMe, myPendings });
}

// here only request which logged in user made and which have been accepted.
// only their posts are to be shown but here i have to add user posts also.
// post are ordered by created time in ascending order.
// indexPage post also contain all the likes count of the post and also
// weather the post is liked by the user or not.

exports.getIndexPage = async ( req, res) => {
    const request_by = req.user.id;
    let posts = await db.getOnlyFriendsPost( request_by );
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
    res.status(200).json({ posts });
}