const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const userRepository = require('../repository/userRepository');

const invalidInput = (message) => Object.assign(new Error(message), { status: 400 });
const ACCESS_TOKEN_TTL = '15m';

const publicUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
});

const createAccessToken = (user) => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    const error = new Error('Authentication is not configured. Set JWT_SECRET in the backend environment.');
    error.status = 503;
    throw error;
  }

  return jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL,
  });
};

const hashRefreshToken = (token) => crypto.createHash('sha256').update(token).digest('hex');
const createRefreshToken = () => crypto.randomBytes(64).toString('base64url');

const ensureJwtConfigured = () => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    const error = new Error('Authentication is not configured. Set JWT_SECRET in the backend environment.');
    error.status = 503;
    throw error;
  }
};

const createSession = async (user) => {
  ensureJwtConfigured();
  const refreshToken = createRefreshToken();
  await userRepository.saveRefreshToken(user._id.toString(), hashRefreshToken(refreshToken));
  return {
    accessToken: createAccessToken(user),
    refreshToken,
    user: publicUser(user),
  };
};

const matchesAdminKey = (providedKey, configuredKey) => {
  if (typeof providedKey !== 'string' || !configuredKey) {
    return false;
  }
  const provided = Buffer.from(providedKey);
  const expected = Buffer.from(configuredKey);
  return provided.length === expected.length && crypto.timingSafeEqual(provided, expected);
};

const register = async ({ name, email, password, role = 'user', adminKey }) => {
  ensureJwtConfigured();
  const normalizedName = typeof name === 'string' ? name.trim() : '';
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  if (normalizedName.length < 2 || normalizedName.length > 100) {
    throw invalidInput('Name must be between 2 and 100 characters.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw invalidInput('Enter a valid email address.');
  }
  if (typeof password !== 'string' || password.length < 8 || password.length > 72) {
    throw invalidInput('Password must be between 8 and 72 characters.');
  }
  if (!['user', 'admin'].includes(role)) {
    throw invalidInput('Select a valid account type.');
  }
  if (role === 'admin' && !process.env.ADMIN_REGISTRATION_KEY) {
    const error = new Error('Admin registration is not configured on the server.');
    error.status = 503;
    throw error;
  }
  if (role === 'admin' && !matchesAdminKey(adminKey, process.env.ADMIN_REGISTRATION_KEY)) {
    const error = new Error('A valid admin registration key is required.');
    error.status = 403;
    throw error;
  }
  if (await userRepository.getByEmail(normalizedEmail)) {
    const error = new Error('An account with this email already exists.');
    error.status = 409;
    throw error;
  }

  const user = await userRepository.create({
    name: normalizedName,
    email: normalizedEmail,
    passwordHash: await bcrypt.hash(password, 12),
    role,
  });

  return createSession(user);
};

const login = async ({ email, password }) => {
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const user = await userRepository.getByEmail(normalizedEmail);
  if (!user || typeof password !== 'string' || !(await bcrypt.compare(password, user.passwordHash))) {
    const error = new Error('Email or password is incorrect.');
    error.status = 401;
    throw error;
  }

  return createSession(user);
};

const refreshSession = async (refreshToken) => {
  if (typeof refreshToken !== 'string' || refreshToken.length < 32) {
    const error = new Error('Your session has expired. Please sign in again.');
    error.status = 401;
    throw error;
  }

  const nextRefreshToken = createRefreshToken();
  const user = await userRepository.rotateRefreshToken(
    hashRefreshToken(refreshToken),
    hashRefreshToken(nextRefreshToken),
  );
  if (!user) {
    const error = new Error('Your session has expired. Please sign in again.');
    error.status = 401;
    throw error;
  }

  return {
    accessToken: createAccessToken(user),
    refreshToken: nextRefreshToken,
    user: publicUser(user),
  };
};

const logout = (refreshToken) =>
  userRepository.revokeRefreshToken(
    typeof refreshToken === 'string' ? hashRefreshToken(refreshToken) : null,
  );

const getCurrentUser = async (id) => {
  const user = await userRepository.getById(id);
  return user ? publicUser(user) : null;
};

module.exports = { register, login, refreshSession, logout, getCurrentUser };
