// routes/routes.js

const express = require('express');
const router = express.Router();
const controllers = require('../controllers/controller.js');
const {isAuthenticated} = require('../controllers/passport-config.js');
const passport = require('passport');
// const upload = require('../controllers/multer.js');
const upload = require('../controllers/upload.js');

router.post('/upload', upload.single('image'), (req, res) => {
  res.json({
    message: 'Upload successful!',
    imageUrl: req.file.path,
  });
});
router.post('/signup',upload.single('profilePic'), controllers.signup);
// router.post('/login', controllers.validateUserlogin,
//     passport.authenticate('local',{ failureFlash: true}),
//     ( req, res)=> {
//         res.status(200).json({ loggedIn : true, message: 'User is logged in', user: req.user});
//     }
// );
router.post('/login', controllers.validateUserlogin,
  passport.authenticate('local', { failureFlash: true }),
  (req, res) => {
    console.log('🎉 LOGIN SUCCESS:');
    console.log('- Session ID:', req.sessionID);
    console.log('- Session data:', req.session);
    console.log('- User ID:', req.user.id);
    console.log('- Is authenticated:', req.isAuthenticated());
    
    res.status(200).json({ 
      loggedIn: true, 
      message: 'User is logged in', 
      user: req.user
    });
  }
);
router.get('/message/:receiverId', isAuthenticated, controllers.getMessages);
router.post('/message/:receiverId', isAuthenticated, controllers.message );
router.post('/logout',isAuthenticated, controllers.logout);
router.get('/home',isAuthenticated, controllers.home);
// router.get('/getProfilePic', isAuthenticated, controllers.getProfilePic);
router.get('/getProfilePic', (req, res) => {
  console.log('🖼️ GET PROFILE PIC REQUEST:');
  console.log('- Session ID:', req.sessionID);
  console.log('- Session data:', req.session);
  console.log('- Is authenticated:', req.isAuthenticated());
  console.log('- User:', req.user);
  
  if (!req.isAuthenticated()) {
    console.log('❌ Not authenticated - sending 401');
    return res.status(401).json({ message: "you need to be logged in." });
  }
  
  // Continue with your getProfilePic logic
  controllers.getProfilePic;
});
router.get('/session-test', (req, res) => {
  res.json({
    sessionID: req.sessionID,
    isAuthenticated: req.isAuthenticated(),
    session: req.session,
    user: req.user
  });
});
router.get('/profile',isAuthenticated, controllers.profile);
router.post('/edit', isAuthenticated, controllers.edit);
router.post('/editProfilePic', isAuthenticated, upload.single('profilePic'),
                controllers.editProfilePic);
router.post('/removeProfilePic', isAuthenticated, controllers.removeProfilePic);
router.get('/status', (req, res)=> {
    res.json({isLoggedin: req.isAuthenticated()});
});

router.post('/post', isAuthenticated, upload.single('photo'), controllers.createPost);
router.get('/post', isAuthenticated, controllers.getAllPosts);
router.delete('/deletePost/:id', isAuthenticated, controllers.deletePost);

router.post('/post/:post_id/comment', isAuthenticated, controllers.createComment);
router.get('/post/:id', isAuthenticated, controllers.getAllOfPost);
router.delete('/comment/:id', isAuthenticated, controllers.deleteComment);

router.post('/post/:post_id/like', isAuthenticated, controllers.handleLike);
router.get('/strangers', isAuthenticated, controllers.getStrangers);

router.post('/friend/request/:id', isAuthenticated, controllers.addFriend);
router.put('/friend/accept/:id', isAuthenticated, controllers.acceptFriend);
router.delete('/friend/reject/:id', isAuthenticated, controllers.rejectFriend);
router.get('/friends/get', isAuthenticated, controllers.getAllFriends);
router.get('/indexPage', isAuthenticated, controllers.getIndexPage);

router.post('/guestLogin', 
    passport.authenticate('local',{ failureFlash: true}),
    ( req, res)=> {
        res.status(200).json({ loggedIn : true, user: req.user});
    }
 );
router.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});


module.exports = router;