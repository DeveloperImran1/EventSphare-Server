const { Server } = require("socket.io");
const http = require('http');
const express = require("express");
const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:['http://localhost:3000'],
        methods:["GET","POST"]
    }
});
const userSocketmap={};

 const getReciverSocketId = (receverId)=>{
    return userSocketmap[receverId];
};


io.on('connection',(socket)=>{
    const userId = socket.handshake.query.userId;

    if(userId !== "undefine") userSocketmap[userId] = socket.id;
    io.emit("getOnlineUsers",Object.keys(userSocketmap))

    socket.on('disconnect',()=>{
        delete userSocketmap[userId],
        io.emit('getOnlineUsers',Object.keys(userSocketmap))
    });
});

module.exports = {app,io,server,getReciverSocketId};