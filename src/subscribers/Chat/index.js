import socket from 'socket.io';

const chatIo = (server) => {
  const io = socket(server);
  let users = {};
  let socketRoom;

  io.of('/chat').on('connection', (socket) => {
    console.log('client is connected now');
    socket.on('isOnline', (userEmail) => {
      socket.userEmail = userEmail;
      users[socket.userEmail] = socket.id;
      console.log('online users', users);
    });

    socket.emit('start', `Welcome to my chat ${socket.id}`);

    // socket.on('type', (isTyping) =>
    //   socket.broadcast.to(users[data.userSocket]).emit('isTyping', true)
    // );
    socket.on('chat', (data) => {
      console.log(data);
      socket.broadcast.to(users[data.userSocket]).emit('message', data.message);
    });

    socket.on('disconnect', (reason) => {
      delete users[socket.userEmail];
      console.log(reason, users);
    });
  });

  return io;
};

export default chatIo;
