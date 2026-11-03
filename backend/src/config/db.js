const mongoose = require('mongoose');

let mongoReady = false;

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.log('MONGO_URI not found. Using local in-memory complaint store.');
    return false;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    mongoReady = true;
    console.log('MongoDB Connected Successfully');
    return true;
  } catch (error) {
    console.log('MongoDB Connection Error:', error.message);
    mongoReady = false;
    return false;
  }
};

const isMongoReady = () => mongoReady;

module.exports = { connectDB, isMongoReady };
