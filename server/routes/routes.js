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

router.post('/post', isAuthenticated, controllers.createPost);
router.get('/post', isAuthenticated, controllers.getAllPosts);
router.delete('/deletePost/:id', isAuthenticated, controllers.deletePost);

router.post('/post/:post_id/comment', isAuthenticated, controllers.createComment);
router.get('/post/:post_id/comments', isAuthenticated, controllers.getAllComments);
router.delete('/comment/:id', isAuthenticated, controllers.deleteComment);

router.post('/post/:post_id/like', isAuthenticated, controllers.addLiked);
router.get('/post/:post_id/getLikes', isAuthenticated, controllers.getAllLikes);
router.delete('/like/:id', isAuthenticated, controllers.deleteLike);

router.post('/friend/request/:id', isAuthenticated, controllers.addFriend);
router.put('/friend/accept/:id', isAuthenticated, controllers.acceptFriend);
router.put('/friend/reject/:id', isAuthenticated, controllers.rejectFriend);
router.get('/friends/get', isAuthenticated, controllers.getAllFriends);
router.get('/indexPage', isAuthenticated, controllers.getIndexPage);

module.exports = router;