const express = require('express');
const {
  createComplaint,
  deleteComplaint,
  getComplaintById,
  getComplaints,
  updateComplaint,
} = require('../controllers/complaintController');
const { authenticate, requireAdmin } = require('../middleware/authenticate');

const router = express.Router();

router.route('/').get(getComplaints).post(authenticate, createComplaint);
router
  .route('/:id')
  .get(getComplaintById)
  .put(authenticate, requireAdmin, updateComplaint)
  .delete(authenticate, requireAdmin, deleteComplaint);

module.exports = router;
