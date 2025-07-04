// db/db.js
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function signupUser(email, username, hashedpass ) {
    try{
        return await prisma.user.create({data: { email, username, hashedpass}})
    }catch(err){
        console.log(err);
        throw err;
    }
}

async function login(username) {
    try{
        return await prisma.user.findUnique({where: {username}, select : { hashedpass: true}});
    }catch(err){
        console.log(err);
        throw err;
    }
}

module.exports = {
    signupUser, login
}