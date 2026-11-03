const complaintService = require('../services/complaintService');

const getComplaints = async (req, res) => {
  try {
    const complaints = await complaintService.getComplaints();
    return res.json(complaints);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch complaints.', error: error.message });
  }
};

const getComplaintById = async (req, res) => {
  try {
    const complaint = await complaintService.getComplaintById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }
    return res.json(complaint);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch complaint.', error: error.message });
  }
};

const createComplaint = async (req, res) => {
  try {
    const complaint = await complaintService.createComplaint(req.body);
    return res.status(201).json(complaint);
  } catch (error) {
    return res.status(400).json({ message: 'Unable to create complaint.', error: error.message });
  }
};

const updateComplaint = async (req, res) => {
  try {
    const complaint = await complaintService.updateComplaint(req.params.id, req.body);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }
    return res.json(complaint);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update complaint.', error: error.message });
  }
};

const deleteComplaint = async (req, res) => {
  try {
    const complaint = await complaintService.deleteComplaint(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }
    return res.json({ message: 'Complaint deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to delete complaint.', error: error.message });
  }
};

module.exports = {
  getComplaints,
  getComplaintById,
  createComplaint,
  updateComplaint,
  deleteComplaint,
};
