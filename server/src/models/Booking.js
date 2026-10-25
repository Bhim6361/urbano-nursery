const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    gardener: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    bookingDate: {
      type: Date,
      required: [true, 'Please select a service date'],
    },
    timeSlot: {
      type: String,
      required: [true, 'Please select a time slot'],
      enum: [
        '09:00 AM - 12:00 PM',
        '12:00 PM - 03:00 PM',
        '03:00 PM - 06:00 PM',
      ],
    },
    serviceAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, default: 'Karnataka' },
      postalCode: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'Rejected'],
      default: 'Pending',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['Cash after Service', 'Demo Online Payment (Card / UPI)'],
      default: 'Cash after Service',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid'],
      default: 'Pending',
    },
    notes: {
      type: String,
      default: '',
    },
    cancellationReason: {
      type: String,
      default: '',
    },
    completedAt: {
      type: Date,
    },
    hasReviewed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
