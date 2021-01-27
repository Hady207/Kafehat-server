import dotenv from 'dotenv';
import express from 'express';
import socket from 'socket.io';
import loaders from './loaders';
// config() will read your .env file, parse the contents, assign it to process.env.
dotenv.config();

async function startServer() {
  const app = express();
  await loaders(app);

  const server = app.listen(process.env.PORT, (err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`Your server is running on port ${process.env.PORT} !`);
  });

  // Socket setup
  const io = socket(server);

  io.on('connection', (socket) => {
    console.log('connect');
  });
}

startServer();
