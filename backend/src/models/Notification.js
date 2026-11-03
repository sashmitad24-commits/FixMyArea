const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['complaint-created', 'status-updated'],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    complaintId: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
