
import io from 'socket.io-client';

let socket = '';
let essentialMethods = { showChatRequestPopup: '', handleRequestAccepted: '', 
onMessageReceived: '', handleLeaveChat: '', handleRequestRejected: '', handleOppositeUserLeftChat: '', user: '' };

export const setEssentialMethods = (showChatRequestPopup, handleRequestAccepted, handleRequestRejected, onMessageReceived, handleLeaveChat, handleOppositeUserLeftChat, user) => {
    essentialMethods.showChatRequestPopup = showChatRequestPopup;
    essentialMethods.handleRequestAccepted = handleRequestAccepted;
    essentialMethods.handleRequestRejected = handleRequestRejected;
    essentialMethods.onMessageReceived = onMessageReceived;
    essentialMethods.handleLeaveChat = handleLeaveChat;
    essentialMethods.handleOppositeUserLeftChat = handleOppositeUserLeftChat;
    essentialMethods.user = user;
}

export const setupSocket = (doctorUserId) => {

    if (!socket) {
        socket = io('/',
            {
                query: {
                    action: 'createRoom',
                    doctorUserId
                }
            });

        socket.on('receive-chat-request', (data) => {
            debugger
            console.log(data);
            essentialMethods.showChatRequestPopup(data);
        });
        socket.on('message', data => essentialMethods.onMessageReceived(data));
        socket.on('left-chat', () => {
            essentialMethods.handleOppositeUserLeftChat();
        })

    }

}

export const sendMessage = (mess, doctorUserId) => {
    debugger
    socket.emit('message', { mess, doctorUserId });
}


export const requestChat = (doctorUserId, requestingUser, showRequestSendMessage) => {
    debugger
    if (!socket || !socket.connected) {
        socket = io('/')
        socket.on('connect', () => {
            debugger
            socket && socket.emit('ask-to-join', { doctorUserId, requestingUser, socketId: socket.id })
    
        });
    }
    else{
        socket.emit('ask-to-join', { doctorUserId, requestingUser, socketId: socket.id })   
    }
    
    
    socket.on('left-chat', () => {
        essentialMethods.handleOppositeUserLeftChat();
    })

    showRequestSendMessage();

    socket.on('request-accepted', (data) => {
        essentialMethods.handleRequestAccepted(data);
        debugger
        socket.emit('join_now', { socketId: data.socketId, doctorUserId: data.doctorUserId });
    });
    socket.on('request-rejected', essentialMethods.handleRequestRejected);
    socket.on('message', data => essentialMethods.onMessageReceived(data))

}

export const leaveChat = (doctorUserId, isDoctor) => {
    debugger
    socket && socket.emit('leave_room', { doctorUserId, isDoctor });
    essentialMethods.handleLeaveChat();
}

export const acceptRejectChatRequest = (acceptOrReject, socketId, doctorUserId) => {
    debugger
    socket.emit(acceptOrReject, { socketId, doctorUserId })
}
