// Node server
// which will handle socket.io connections.

const io = require('socket.io')(8000);

const users = {};

// when connection comes run this function
io.on('connection',socket=>{

    // when new user joins, let other connected users know
    socket.on('new-user-joined', name => {
        // console.log("New user", name);
        users[socket.id] = name;                       // append users name
        socket.broadcast.emit('user-joined', name);    // notify
    });

    // when user sends new message, broadcast it
    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]});
    });

    // when user leaves the chat, notify others
    // disconnect --> built in event
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id]; 
    });

})