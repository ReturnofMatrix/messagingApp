// db/db.js
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function signupUser(email, username, hashedpass, birthday, bio, hobbies) {
    try{
        return await prisma.user.create({data: { email, username, hashedpass, birthday, bio, hobbies}})
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

async function alreadyRegistered(email) {
    return await prisma.user.findUnique({ where: {email}});
}

async function getAllMessages(senderid, receiverid) {
    return await prisma.messages.findMany({
        where: {
            OR: [
                {senderid, receiverid},
                {senderid: receiverid, receiverid: senderid}
            ],
        },
        orderBy: {
            time: 'asc'
        }
    });
}

async function sendMessage(senderid, receiverid, text) {
    return await prisma.messages.create({
        data: {
            senderid, receiverid, text, time: new Date()
        }
    });
}

async function getUsers(id) {
    return await prisma.user.findMany({
        where: {id: { not: id }},
        select: { id: true, username: true}
    });
}

async function getProfileInfo(id) {
    return await prisma.user.findFirst({ 
        where : {id}, omit: { hashedpass: true, id : true}
    });
}

async function edit(id, editKey, editValue) {
    const dataToUpdate = {};
    dataToUpdate[editKey] = editValue;
    return await prisma.user.update({
        where: {
            id
        },
        data: dataToUpdate
    });
}

module.exports = {
    signupUser, login, alreadyRegistered, sendMessage,
    getUsers, getProfileInfo, getAllMessages, edit
}