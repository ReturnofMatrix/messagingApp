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

async function createPost(author_id, content) {
    return await prisma.post.create({
        data: {
            content, author_id, created_at: new Date()
        }
    })
}

async function getUserPosts(author_id) {
    return await prisma.post.findMany({
        where: {
            author_id
        }
    })   
}

async function deletePost(id, author_id) {
    return await prisma.post.delete({
        where: {
            id, author_id
        }
    });
}

async function createComment(created_by, text, post_id) {
    return await prisma.comment.create({
        data:{
            created_by, text, post_id, created_at: new Date()
        }
    })
}

async function getAllComments(post_id) {
    return await prisma.comment.findMany({
        where: {post_id}
    });
}

async function deleteComment(id) {
    return await prisma.comment.delete({
        where: {id}
    })
}

async function addLiked(post_id, liked_by) {
    return await prisma.likes.create({
        data: {
            liked_by, post_id, liked_at: new Date()
        }
    })
}

async function getAllLikes( post_id) {
    return await prisma.likes.findMany()
}

async function deleteLike(id) {
    return await prisma.likes.delete({
        where: {id}
    })
}

async function addFriend( request_by, request_to) {
    return await prisma.friends.create({
        data: {request_by, request_to}
    });
}

async function acceptFriend( id ) {
    return await prisma.friends.update({
        where: {id},
        data: {accepted: true, pending: false}
    });
}

async function rejectFriend( id ) {
    return await prisma.friends.update({
        where: {id},
        data: {accepted: false, pending: false}
    });
}

async function getAllFriends( id ) {
    return await prisma.friends.findMany({
        where: {
            OR: [
                {request_by: id},
                {request_to: id}
            ]}
    });
}

async function getOnlyFriendsPost( request_by ) {
    const friends = await prisma.friends.findMany({
        where: {request_by, accepted: true},
        select: {request_to: true}
    })

    let friendsIds = friends.map(friend => friend.request_to);
    friendsIds.push(request_by);
    console.log(friendsIds);

    return await prisma.post.findMany({
        where: {author_id: {in: friendsIds}},
        orderBy: {created_at : 'asc'}
    })
}

module.exports = { signupUser, login, alreadyRegistered, sendMessage,
    getUsers, getProfileInfo, getAllMessages, edit, createPost, getUserPosts,
    deletePost, createComment, getAllComments, deleteComment, addLiked, getAllLikes, deleteLike,
    addFriend, acceptFriend, rejectFriend, getAllFriends, getOnlyFriendsPost
}