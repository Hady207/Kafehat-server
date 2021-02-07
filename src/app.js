import dotenv from 'dotenv';
import express from 'express';
import socket from 'socket.io';
import loaders from './loaders';
import chatIo from './subscribers/Chat';
// config() will read your .env file, parse the contents, assign it to process.env.
dotenv.config();

const startServer = async () => {
  const app = express();
  await loaders(app);

  const server = app.listen(process.env.PORT, (err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`Your server is running on port ${process.env.PORT} !`);
  });

  // const io = socket(server);
  chatIo(server);
};

startServer();
