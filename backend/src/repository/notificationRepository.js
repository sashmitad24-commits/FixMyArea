const Notification = require('../models/Notification');
const { isMongoReady } = require('../config/db');

const localNotifications = [];

const normalizeNotification = (notification) => ({
  ...notification,
  _id: notification._id?.toString ? notification._id.toString() : notification._id,
});

const getAll = async () => {
  if (isMongoReady()) {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(50);
    return notifications.map(normalizeNotification);
  }

  return localNotifications.slice(0, 50);
};

const create = async (payload) => {
  if (isMongoReady()) {
    const notification = await Notification.create(payload);
    return normalizeNotification(notification);
  }

  const notification = {
    _id: `notification-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ...payload,
    read: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  localNotifications.unshift(notification);
  return notification;
};

const markRead = async (id) => {
  if (isMongoReady()) {
    const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
    return notification ? normalizeNotification(notification) : null;
  }

  const notification = localNotifications.find((item) => item._id === id);
  if (!notification) {
    return null;
  }

  notification.read = true;
  notification.updatedAt = new Date().toISOString();
  return notification;
};

const markAllRead = async () => {
  if (isMongoReady()) {
    await Notification.updateMany({ read: false }, { read: true });
    return;
  }

  localNotifications.forEach((notification) => {
    notification.read = true;
    notification.updatedAt = new Date().toISOString();
  });
};

module.exports = { getAll, create, markRead, markAllRead };
