import expressLoader from './express';
import mongooseLoader from './mongoose';

// const expressLoader = require('./express');
// const mongooseLoader = require('./mongoose');

const loaders = async (app) => {
  const mongoConnection = await mongooseLoader();
  console.log('MongoDB Initialized');
  await expressLoader({ app });
  console.log('Express Initialized');

  // ... more loaders can be here

  // ... Initialize agenda
  // ... or Redis, or whatever you want
};

module.exports = loaders;
