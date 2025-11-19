//controllers/socket.js
const db = require('../db/db');

//helper function to set room name for socket.
function getRoomName(a, b) {
  const [x, y] = [a, b].sort((p, q) => p - q);
  return `chat:${x}-${y}`;
}

function setupSocket(io){

    io.on("connection", (socket)=> {
        console.log("user connected.", socket.id);

        socket.on("joinRoom", ({ myId, receiverId }) => {
            if (!myId || !receiverId) return;
            const room = getRoomName(myId, receiverId);
            socket.join(room);
            console.log(`User ${myId} joined ${room}.`);
        });

        socket.on("leaveRoom", ({myId, receiverId})=>{
            if (!myId || !receiverId) return;
            const room = getRoomName(myId, receiverId);
            socket.leave(room);
            console.log(`User ${myId} left ${room}.`);
        });

        socket.on("disconnect", ()=>{
            console.log("User disconnected : ", socket.id);
        });
    });
}

module.exports = {setupSocket, getRoomName};