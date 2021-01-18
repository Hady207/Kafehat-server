import mongoose from 'mongoose';

const mongooseLoader = async () => {
  const connection = await mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return connection.connection.db;
};

export default mongooseLoader;
