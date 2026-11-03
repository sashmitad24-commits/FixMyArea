const express = require('express');
const { rateLimit } = require('express-rate-limit');
const { getCurrentUser, login, logout, refresh, register } = require('../controllers/authController');
const { authenticate } = require('../middleware/authenticate');

const router = express.Router();
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts. Please try again later.' },
});

router.post('/register', authRateLimit, register);
router.post('/login', authRateLimit, login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', authenticate, getCurrentUser);

module.exports = router;
