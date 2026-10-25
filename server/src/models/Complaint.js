const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['Order', 'Booking', 'Product', 'Vendor', 'Other'],
      default: 'Order',
    },
    referenceId: {
      type: String,
      default: '',
    },
    subject: {
      type: String,
      required: [true, 'Please specify the subject'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide details of your complaint or dispute'],
      trim: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Open', 'In-Review', 'Resolved'],
      default: 'Open',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    resolution: {
      type: String,
      default: '',
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Complaint', complaintSchema);
