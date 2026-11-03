const complaintRepository = require('../repository/complaintRepository');
const notificationService = require('./notificationService');

const normalizePayload = (payload = {}) => ({
  title: payload.title?.trim(),
  category: payload.category?.trim(),
  location: payload.location?.trim(),
  description: payload.description?.trim(),
  priority: payload.priority || 'Medium',
  reporterName: payload.reporterName?.trim(),
  contact: payload.contact?.trim() || '',
  status: payload.status || 'Open',
});

const validateComplaint = (payload) => {
  const requiredFields = ['title', 'category', 'location', 'description', 'reporterName'];

  for (const field of requiredFields) {
    if (!payload[field] || !String(payload[field]).trim()) {
      throw new Error(`${field} is required.`);
    }
  }

  const validStatuses = ['Open', 'In Progress', 'Resolved', 'Closed'];
  const validPriorities = ['Low', 'Medium', 'High', 'Critical'];

  if (!validPriorities.includes(payload.priority)) {
    throw new Error('Invalid priority value.');
  }

  if (payload.status && !validStatuses.includes(payload.status)) {
    throw new Error('Invalid status value.');
  }
};

const getComplaints = async () => complaintRepository.getAllComplaints();

const getComplaintById = async (id) => complaintRepository.getComplaintById(id);

const createComplaint = async (payload) => {
  const normalized = normalizePayload(payload);
  validateComplaint(normalized);
  const complaint = await complaintRepository.createComplaint(normalized);
  await notificationService.notifyComplaintCreated(complaint);
  return complaint;
};

const updateComplaint = async (id, payload) => {
  const existingComplaint = await complaintRepository.getComplaintById(id);
  if (!existingComplaint) {
    return null;
  }

  const normalized = normalizePayload(payload);
  validateComplaint(normalized);
  const complaint = await complaintRepository.updateComplaint(id, normalized);

  if (complaint && complaint.status !== existingComplaint.status) {
    await notificationService.notifyStatusUpdated(complaint, existingComplaint.status);
  }

  return complaint;
};

const deleteComplaint = async (id) => complaintRepository.deleteComplaint(id);

module.exports = {
  getComplaints,
  getComplaintById,
  createComplaint,
  updateComplaint,
  deleteComplaint,
};
