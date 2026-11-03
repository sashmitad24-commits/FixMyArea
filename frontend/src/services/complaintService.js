import api from './api';

const getComplaints = async () => {
  const response = await api.get('/complaints');
  return response.data;
};

const createComplaint = async (payload) => {
  const response = await api.post('/complaints', payload);
  return response.data;
};

const updateComplaint = async (id, payload) => {
  const response = await api.put(`/complaints/${id}`, payload);
  return response.data;
};

const deleteComplaint = async (id) => {
  const response = await api.delete(`/complaints/${id}`);
  return response.data;
};

export default {
  getComplaints,
  createComplaint,
  updateComplaint,
  deleteComplaint,
};
