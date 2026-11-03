const notificationRepository = require('../repository/notificationRepository');

const getNotifications = () => notificationRepository.getAll();

const notifyComplaintCreated = (complaint) =>
  notificationRepository.create({
    type: 'complaint-created',
    title: 'New complaint reported',
    message: `${complaint.title} was reported in ${complaint.location}.`,
    complaintId: complaint._id,
  });

const notifyStatusUpdated = (complaint, previousStatus) =>
  notificationRepository.create({
    type: 'status-updated',
    title: 'Complaint status updated',
    message: `${complaint.title}: ${previousStatus} → ${complaint.status}.`,
    complaintId: complaint._id,
  });

const markNotificationRead = (id) => notificationRepository.markRead(id);

const markAllNotificationsRead = () => notificationRepository.markAllRead();

module.exports = {
  getNotifications,
  notifyComplaintCreated,
  notifyStatusUpdated,
  markNotificationRead,
  markAllNotificationsRead,
};
