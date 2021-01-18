import dotenv from 'dotenv';
import express from 'express';
import loaders from './loaders';
// config() will read your .env file, parse the contents, assign it to process.env.
dotenv.config();

async function startServer() {
  const app = express();
  await loaders(app);

  app.listen(process.env.PORT, (err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`Your server is running on port ${process.env.PORT} !`);
  });
}

startServer();
