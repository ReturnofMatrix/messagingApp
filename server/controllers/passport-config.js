// passport-config.js

const LocalStrategy = require('passport-local').Strategy;
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

function initialize(passport){
    const authenticateUser = async ( username, password, done) => {

        try{
            const user = await prisma.user.findUnique({
                where: { username}
            });
            if(!user){
                return done(null, false, {message: "No user found."})
            }

            const match = await bcrypt.compare(password, user.hashedpass);

            if(match){
                return done(null, user);
            }else{
                return done(null, false, { message: "Wrong password !"});
            }

        }catch(err){
            return done(err);
        }
    };

    passport.use(new LocalStrategy(authenticateUser));

    passport.serializeUser((user, done) => done(null, user.id));
    
    passport.deserializeUser(async (id, done) => {
        try{
            const user = await prisma.user.findUnique({ where: {id}});
            done(null, user);
        }catch(err){
            throw done(err);
        }
    });
}

function isAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    return res.status(401).json({message : "you need to be logged in."});
}

module.exports = { initialize, isAuthenticated };