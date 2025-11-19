// db/db.js
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function signupUser(email, username,gender, hashedpass, birthday, bio, hobbies, profilePicUrl) {
    try{
        return await prisma.user.create({data: { email, username, gender, hashedpass, birthday, bio, hobbies, profilePic: profilePicUrl}})
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

async function saveMessageToDatabase({senderid, receiverid, text}) {
    return await prisma.messages.create({
        data: {
            senderid, receiverid, text, time: new Date()
        }
    });
}

async function getFriendName(id) {
    return await prisma.user.findFirst({
        where: {id},
        select: {username: true}
    });
}

async function getUsername(id) {
    return await prisma.user.findMany({
        where: {id}, select: {username: true}
    });
}

// here i have to get all the receiverId where user has send request and
// pending false and accepted true. then
// filter out where if receiverId is sender and user is receiver and 
// and that is pending is false and accepted is true.
async function getMessageFriends(request_by){
    let receiverId = await prisma.friends.findMany({
        where: { AND : [{request_by}, {pending: false}, {accepted: true}]},
        select: {request_to: true}
    });

    receiverId = receiverId.map(receiverId => receiverId.request_to);

    return await prisma.friends.findMany({
        where: {AND: [{request_by: {in: receiverId}}, {request_to: request_by},
                {pending: false, accepted: true}]},
        select: {requested: {select: { id: true, username: true}}}
    })
}

async function getProfilePic(id) {
    return await prisma.user.findFirst({
        where: {id},
        select: {profilePic: true}
    });
}

async function getProfileInfo(id) {
    return await prisma.user.findFirst({ 
        where : {id}, omit: { hashedpass: true, id : true, profilePic: true}
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

async function editProfilePic( id, profilePic) {
    return await prisma.user.update({
        where: {id},
        data: {profilePic}
    });
}

async function getGender(id) {
    return await prisma.user.findMany({
        where: {id},
        select: {gender: true}
    });
}

async function removeProfilePic(id, profilePic) {
    return await prisma.user.update({
        where: {id},
        data: {profilePic}
    });
}

async function createPost(author_id, caption, photo) {
    return await prisma.post.create({
        data: {
            caption, created_at: new Date(), photo, 
            author: {connect: {id: author_id}}
        }
    })
}

async function getUserPosts(author_id) {
    return await prisma.post.findMany({
        where: {
            author_id
        },
        include: {
            author: {select: {username: true}}, 
            hasLikes: {select: {liked_by: true}},
            hasComments: {select: {id : true}}
        },
        orderBy: {created_at : 'desc'}
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

async function getAllOfPost(id) {
    console.log(id);
    return await prisma.post.findUnique({
        where: {id},
        include: { author: {select: { username: true}},
                   hasLikes: {select: {liked_by: true}},
                   hasComments: {include: {commenter: {select: {username: true}}}}}
    });
}

async function deleteComment(id) {
    return await prisma.comment.delete({
        where: {id}
    })
}

async function handleLike(post_id, liked_by) {
    const liked = await prisma.likes.findUnique({
        where: { liked_by_post_id: {
            liked_by, post_id
        }}
    });
    console.log('liked returned.',liked);
    if(liked){
        return await prisma.likes.delete({
            where: { liked_by_post_id: {
                liked_by, post_id
            }}
        });
    }else{
        return await prisma.likes.create({
        data: { liked_by, post_id, liked_at: new Date() }
        })
    }
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
    return await prisma.friends.delete({
        where: {id}
    });
}

async function getStrangers(id) {
    const friends = await prisma.friends.findMany({
        where: {request_by: id},
        select: {request_to: true}
    });
    const friendsId = friends.map(friend => friend.request_to);
    friendsId.push(id);
    console.log('your friends id ', friendsId);

    return await prisma.user.findMany({
        where: {id: {notIn: friendsId}},
        select: {username: true, id: true}
    })
}

async function getAllFriends( id ) {
    return await prisma.friends.findMany({
        where: { 
                OR: [
                {request_by: id},
                {request_to: id}
            ]},
        include: {requester: {select: {username: true}}, requested: {select: {username: true}}}
    });
}

async function getOnlyFriendsPost( request_by ) {
    const friends = await prisma.friends.findMany({
        where: {request_by, accepted: true},
        select: {request_to: true}
    })
    // all the friends is an array of objects which has request_to who 
    // have accepted the friend request. so by returning the friend.request_to
    // we get the array of request_to.
    let friendsIds = friends.map(friend => friend.request_to);
    friendsIds.push(request_by);
    console.log(friendsIds);

    return await prisma.post.findMany({
        where: {author_id: {in: friendsIds}},
        include: {
            author: {select: {username: true}}, 
            hasLikes: {select: {liked_by: true}},
            hasComments: {select: {id : true}}
        },
        orderBy: {created_at : 'desc'}
    });
}

async function getAllPosts( request_by ) {

    return await prisma.post.findMany({
        include: {
            author: {select: {username: true}}, 
            hasLikes: {select: {liked_by: true}},
            hasComments: {select: {id : true}}
        },
        orderBy: {created_at : 'desc'}
    });
}


module.exports = { signupUser, login, alreadyRegistered, saveMessageToDatabase,
    getMessageFriends, getProfileInfo, getAllMessages, edit,editProfilePic, 
    getGender, removeProfilePic, createPost,getUserPosts, getUsername,
    deletePost, createComment, getAllOfPost, deleteComment, 
    handleLike, addFriend, acceptFriend, rejectFriend,getAllFriends, getStrangers, 
    getOnlyFriendsPost, getProfilePic, getAllPosts, getFriendName,
    
}