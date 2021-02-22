import socket from 'socket.io';

const chatIo = (server) => {
  const io = socket(server);
  let users = {};
  let socketRoom;

  io.of('/chat').on('connection', (socket) => {
    socket.emit('start', `Welcome to my chat ${socket.id}`);
    socket.on('chat', (data) => {
      console.log(data);

      // io.emit('message', data);
    });
    socket.on('disconnect', (reason) => {
      // ...
      // users = users.filter((el) => el != socket.id);
      console.log(reason, users);
    });
  });

  return io;
};

export default chatIo;
