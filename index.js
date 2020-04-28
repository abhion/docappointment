const express = require('express');
const setupDB = require('./config/database');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, { origins: '*:*' });
const router = require('./config/routes');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 3000;
const path = require('path') 


 const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.PASS
    }
});


module.exports = transporter;
console.log();
app.use(cors());
app.use(express.json());
app.use('/', router);   
app.use(express.static(path.join(__dirname,"/client/docappointment-ui/build"))) 
console.log(__dirname, "__dirname");
app.use('/userfiles', express.static(__dirname + `/userfiles`))
        app.get("*",(req,res) => { 
            res.sendFile(path.join(__dirname + "/client/docappointment-ui/build/index.html")) 
        }) 

io.on('connection', (socket) => {
    const socketQuery = socket.handshake.query;
    if (socketQuery.action === 'createRoom' && socketQuery.doctorUserId) {
        socket.join(socketQuery.doctorUserId);
    }
    socket.on('leave_room', (data) => {
        io.to(data.doctorUserId).emit('left-chat');
        socket.leaveAll();
    });
    
    socket.on('ask-to-join', (data) => {

        const roomToJoin = data.doctorUserId;
        if(io.sockets.adapter.rooms[data.doctorUserId]){
            const numOfPeopleInRoom = io.sockets.adapter.rooms[data.doctorUserId] && io.sockets.adapter.rooms[data.doctorUserId].length;
            if(numOfPeopleInRoom === 1){
            io.to(roomToJoin).emit('receive-chat-request', { socketId: data.socketId, requestingUser: data.requestingUser, doctorUserId: data.doctorUserId });
            }
        }

    })
    socket.on('join_now', (data) => {
        socket.join(data.doctorUserId)
    })
    socket.on('accept-request', (data) => {
        io.to(data.socketId).emit('request-accepted', data);
        const numOfPeopleInRoom = io.sockets.adapter.rooms;
        console.log("numOfPeopleInRoom",numOfPeopleInRoom, "numOfPeopleInRoom");
    });
    socket.on('reject-request', (data) => {
        io.to(data.doctorUserId).emit('request-rejected');
    });

    socket.on('message', function (data) {
        console.log("Mess from doc", data);
        socket.to(data.doctorUserId).emit('message', data.mess);
    })
})

setupDB();
server.listen(port, () => {
    console.log("running on port " + port);
})

 

