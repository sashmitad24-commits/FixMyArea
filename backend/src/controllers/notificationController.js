const notificationService = require('../services/notificationService');

const getNotifications = async (req, res) => {
  try {
    return res.json(await notificationService.getNotifications());
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch notifications.', error: error.message });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const notification = await notificationService.markNotificationRead(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }
    return res.json(notification);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update notification.', error: error.message });
  }
};

const markAllNotificationsRead = async (req, res) => {
  try {
    await notificationService.markAllNotificationsRead();
    return res.json({ message: 'All notifications marked as read.' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update notifications.', error: error.message });
  }
};

module.exports = { getNotifications, markNotificationRead, markAllNotificationsRead };
