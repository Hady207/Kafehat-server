import socket from 'socket.io';

const chatIo = (server) => {
  const users = [];
  const io = socket(server);
  io.of('/chat').on('connection', (socket) => {
    socket.emit('start', `Welcome to my chat${socket.id}`);
    users.push(socket.id);
    console.log('connected users', users);
    socket.on('message', (arg) => {
      console.log(arg);
      io.emit('message', arg);
    });
  });

  return io;
};

export default chatIo;
