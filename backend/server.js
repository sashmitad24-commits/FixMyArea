const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const { connectDB } = require('./src/config/db');
const complaintRoutes = require('./src/routes/complaintRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const configuredFrontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin(origin, callback) {
    const isLocalDevelopmentOrigin =
      process.env.NODE_ENV !== 'production' &&
      /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin || '');

    if (!origin || origin === configuredFrontendUrl || isLocalDevelopmentOrigin) {
      return callback(null, true);
    }

    return callback(new Error('Origin is not allowed by CORS.'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Fix My Area API is running.' });
});

app.use('/api/complaints', complaintRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong on the server.',
    error: err.message,
  });
});

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
