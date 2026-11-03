const authService = require('../services/authService');
const REFRESH_COOKIE = 'fixmyarea_refresh';
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/api/auth',
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

const sendSession = (res, session, status = 200) =>
  res
    .cookie(REFRESH_COOKIE, session.refreshToken, REFRESH_COOKIE_OPTIONS)
    .status(status)
    .json({ accessToken: session.accessToken, user: session.user });

const clearRefreshCookie = (res) =>
  res.clearCookie(REFRESH_COOKIE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/auth',
  });

const register = async (req, res) => {
  try {
    return sendSession(res, await authService.register(req.body), 201);
  } catch (error) {
    const status = error.status || (error.code === 11000 ? 409 : 500);
    return res.status(status).json({ message: status === 500 ? 'Unable to create account.' : error.message });
  }
};

const login = async (req, res) => {
  try {
    return sendSession(res, await authService.login(req.body));
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: status === 500 ? 'Unable to sign in.' : error.message });
  }
};

const refresh = async (req, res) => {
  try {
    return sendSession(res, await authService.refreshSession(req.cookies[REFRESH_COOKIE]));
  } catch (error) {
    clearRefreshCookie(res);
    return res.status(error.status || 500).json({
      message: error.status ? error.message : 'Unable to refresh your session.',
    });
  }
};

const logout = async (req, res) => {
  try {
    await authService.logout(req.cookies[REFRESH_COOKIE]);
    return clearRefreshCookie(res).json({ message: 'Signed out successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to sign out.', error: error.message });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await authService.getCurrentUser(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Account not found.' });
    }
    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve account.', error: error.message });
  }
};

module.exports = { register, login, refresh, logout, getCurrentUser };
