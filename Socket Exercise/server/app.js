const app = require('express');
const http = require('http').createServer(app);
var io = require('socket.io')(http);
''
io.on('connection', (socket) => {
  // console.log('new client connected', socket.id);

  socket.on('user_join', (user) => {
    console.log(`A user joined Room#: ${user.room}, their name is ${user.name}`);
    socket.broadcast.emit('user_join', user);
  });

  socket.on('message', ({name, message, room}) => {
    
    const data = {name: name, message: message, room: room}
    console.log(data)
    socket.broadcast.emit('message', data);
    //io.emit('message', {name, message, room});
  });

  socket.on('disconnect', () => {
    console.log('Disconnect Fired');
  });
});

http.listen(4000, () => {
  console.log(`listening on *:${4000}`);
});
