const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    refreshTokenHash: { type: String, default: null, select: false },
  },
  { timestamps: true },
);

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
