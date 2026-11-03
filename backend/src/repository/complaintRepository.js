const Complaint = require('../models/Complaint');
const { isMongoReady } = require('../config/db');
const crypto = require('crypto');

const createTicketId = () => `FMA-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;

const localComplaints = [
  {
    _id: 'demo-1',
    title: 'Broken streetlight near the community park',
    category: 'Street Lights',
    location: 'North Lane, Ward 4',
    description: 'The streetlight near the community park has been non-functional for over a week, creating safety concerns for evening walkers.',
    priority: 'High',
    reporterName: 'Priya Nair',
    contact: '9876543210',
    status: 'In Progress',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'demo-2',
    title: 'Dirty drainage blockage after rain',
    category: 'Drainage',
    location: 'Main Road, Sector 8',
    description: 'Waterlogging is persisting near the market area due to blocked drains, causing traffic obstruction and unhygienic conditions.',
    priority: 'Critical',
    reporterName: 'Rahul Singh',
    contact: '9123456780',
    status: 'Open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const normalizeComplaint = (complaint) => ({
  ...complaint,
  _id: complaint._id?.toString ? complaint._id.toString() : complaint._id,
});

const getAllComplaints = async () => {
  if (isMongoReady()) {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    return complaints.map(normalizeComplaint);
  }

  return localComplaints;
};

const getComplaintById = async (id) => {
  if (isMongoReady()) {
    const complaint = await Complaint.findById(id);
    return complaint ? normalizeComplaint(complaint) : null;
  }

  return localComplaints.find((item) => item._id === id) || null;
};

const createComplaint = async (payload) => {
  const complaintData = {
    ...payload,
    ticketId: createTicketId(),
  };

  if (isMongoReady()) {
    const complaint = await Complaint.create(complaintData);
    return normalizeComplaint(complaint);
  }

  const newComplaint = {
    _id: `local-${Date.now()}`,
    ...complaintData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  localComplaints.unshift(newComplaint);
  return newComplaint;
};

const updateComplaint = async (id, payload) => {
  if (isMongoReady()) {
    const complaint = await Complaint.findByIdAndUpdate(id, payload, { new: true });
    return complaint ? normalizeComplaint(complaint) : null;
  }

  const itemIndex = localComplaints.findIndex((item) => item._id === id);
  if (itemIndex === -1) {
    return null;
  }

  const updatedComplaint = {
    ...localComplaints[itemIndex],
    ...payload,
    updatedAt: new Date().toISOString(),
  };

  localComplaints[itemIndex] = updatedComplaint;
  return updatedComplaint;
};

const deleteComplaint = async (id) => {
  if (isMongoReady()) {
    const complaint = await Complaint.findByIdAndDelete(id);
    return complaint ? normalizeComplaint(complaint) : null;
  }

  const itemIndex = localComplaints.findIndex((item) => item._id === id);
  if (itemIndex === -1) {
    return null;
  }

  const [removedComplaint] = localComplaints.splice(itemIndex, 1);
  return removedComplaint;
};

module.exports = {
  getAllComplaints,
  getComplaintById,
  createComplaint,
  updateComplaint,
  deleteComplaint,
};
