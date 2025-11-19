// passport-config.js
const { Strategy: JwtStrategy, ExtractJwt} = require('passport-jwt');
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const passport = require('passport');

const opts = {
    jwtFromRequest: ExtractJwt.fromExtractors([
        ( req ) => req.cookies?.token
    ]),
    secretOrKey: process.env.JWT_SECRET
}

function initialize(passport){
    passport.use(new JwtStrategy( opts, async ( jwt_payload, done) => {
        try{
            const user = await prisma.user.findUnique({
                where: { id: jwt_payload.userId }
            });
            if(user){
                return done(null, user);
            }
            else{
                return done(null, false, {message: 'No user found.'});
            }
        }catch(err){
            return done(err);
        }
    }));
};

function isAuthenticated(req, res, next){
    passport.authenticate('jwt', { session: false}, (err, user, info) => {
        if( err || !user){
            return res.status(401).json({ message: info?.message || 'Unauthorized'});
        }
        req.user = user;
        next();
    })(req, res, next);
}

module.exports = { initialize, isAuthenticated };