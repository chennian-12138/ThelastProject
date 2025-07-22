const mongoose = require('mongoose');
require('dotenv').config();

async function testMongo() {
  try {
    // 使用本地环境变量
    const uri = 'mongodb://localhost:27017/vue_auth';
    await mongoose.connect(uri, {
    });
    console.log('MongoDB连接成功');
    mongoose.disconnect();
  } catch (error) {
    console.error('MongoDB连接失败:', error.message);
  }
}

testMongo();