const User = require('../models/User');
const { isMongoReady } = require('../config/db');

const localUsers = [];

const getByEmail = async (email) => {
  if (isMongoReady()) {
    return User.findOne({ email });
  }

  return localUsers.find((user) => user.email === email) || null;
};

const getById = async (id) => {
  if (isMongoReady()) {
    return User.findById(id).select('+refreshTokenHash');
  }

  return localUsers.find((user) => user._id === id) || null;
};

const rotateRefreshToken = async (currentHash, nextHash) => {
  if (isMongoReady()) {
    return User.findOneAndUpdate(
      { refreshTokenHash: currentHash },
      { refreshTokenHash: nextHash },
      { new: true },
    ).select('+refreshTokenHash');
  }

  const user = localUsers.find((item) => item.refreshTokenHash === currentHash);
  if (!user) {
    return null;
  }
  user.refreshTokenHash = nextHash;
  return user;
};

const revokeRefreshToken = async (refreshTokenHash) => {
  if (!refreshTokenHash) {
    return;
  }
  if (isMongoReady()) {
    await User.updateOne({ refreshTokenHash }, { $set: { refreshTokenHash: null } });
    return;
  }

  const user = localUsers.find((item) => item.refreshTokenHash === refreshTokenHash);
  if (user) {
    user.refreshTokenHash = null;
  }
};

const saveRefreshToken = async (id, refreshTokenHash) => {
  if (isMongoReady()) {
    return User.findByIdAndUpdate(id, { refreshTokenHash }, { new: true });
  }
  const user = localUsers.find((item) => item._id === id);
  if (!user) {
    return null;
  }
  user.refreshTokenHash = refreshTokenHash;
  return user;
};

const create = async (userData) => {
  if (isMongoReady()) {
    return User.create(userData);
  }

  const user = {
    _id: `local-user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ...userData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  localUsers.push(user);
  return user;
};

module.exports = {
  getByEmail,
  getById,
  create,
  rotateRefreshToken,
  revokeRefreshToken,
  saveRefreshToken,
};
