import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['chat', 'literature'],
    required: true,
    index: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, { 
  timestamps: true,
  indexes: [
    { userId: 1, type: 1, timestamp: -1 },
    { userId: 1, type: 1 }
  ]
});

// 添加复合索引优化查询
historySchema.index({ userId: 1, type: 1, createdAt: -1 });

export default mongoose.model('History', historySchema);
