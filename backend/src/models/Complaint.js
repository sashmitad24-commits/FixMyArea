const mongoose = require('mongoose');
const crypto = require('crypto');

const complaintSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
      default: () => `FMA-${crypto.randomBytes(6).toString('hex').toUpperCase()}`,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    reporterName: {
      type: String,
      required: true,
      trim: true,
    },
    contact: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
      default: 'Open',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Complaint || mongoose.model('Complaint', complaintSchema);
