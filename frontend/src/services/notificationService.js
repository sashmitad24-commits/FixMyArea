import api from './api';

const getNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data;
};

const markRead = async (id) => {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data;
};

const markAllRead = async () => {
  const response = await api.patch('/notifications/read-all');
  return response.data;
};

export default { getNotifications, markRead, markAllRead };
