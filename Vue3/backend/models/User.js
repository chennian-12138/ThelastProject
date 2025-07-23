import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, '请输入有效的邮箱地址']
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      minlength: 2,
      maxlength: 20,
      match: [/^[a-zA-Z0-9_-]+$/, '用户名只能包含字母、数字、下划线和横线']
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profile: {
      firstName: String,
      lastName: String,
      avatar: String,
      bio: String
    },
    preferences: {
      theme: { type: String, enum: ['light', 'dark'], default: 'light' },
      language: { type: String, default: 'zh-CN' },
      notifications: {
        email: { type: Boolean, default: true },
        browser: { type: Boolean, default: true }
      }
    },
    stats: {
      loginCount: { type: Number, default: 0 },
      lastLoginAt: Date,
      lastLoginIP: String
    }
  },
  { 
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {
        delete ret.password;
        return ret;
      }
    }
  }
);

// 索引优化
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

export default mongoose.model('User', userSchema);
