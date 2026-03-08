const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('user:pass@cluster')) {
    throw new Error(
      'MONGODB_URI is not set. Add your MongoDB Atlas connection string to backend/.env'
    );
  }
  const conn = await mongoose.connect(uri);
  console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  return conn;
};

module.exports = connectDB;
