const mongoose = require('mongoose');
require('dotenv').config();

async function testMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vue_auth', {
    });
    console.log('MongoDB连接成功');
    mongoose.disconnect();
  } catch (error) {
    console.error('MongoDB连接失败:', error.message);
  }
}

testMongo();