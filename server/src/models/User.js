const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },
    role: {
      type: String,
      enum: ['customer', 'nursery', 'gardener', 'admin'],
      default: 'customer',
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      postalCode: { type: String, default: '' },
      country: { type: String, default: 'India' },
    },
    vendorStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: function () {
        return this.role === 'customer' || this.role === 'admin'
          ? 'approved'
          : 'pending';
      },
    },
    gardenerProfile: {
      bio: { type: String, default: '' },
      experienceYears: { type: Number, default: 2 },
      specialties: {
        type: [String],
        default: ['Lawn Care', 'Plant Pruning', 'Potting & Repotting'],
      },
      hourlyRate: { type: Number, default: 350 },
      rating: { type: Number, default: 4.9, min: 1, max: 5 },
      reviewCount: { type: Number, default: 0 },
      availableDays: {
        type: [String],
        default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      },
      workingHours: { type: String, default: '09:00 AM - 06:00 PM' },
      isAvailable: { type: Boolean, default: true },
    },
    nurseryProfile: {
      nurseryName: { type: String, default: '' },
      description: { type: String, default: '' },
      businessAddress: { type: String, default: '' },
      city: { type: String, default: '' },
      rating: { type: Number, default: 4.8, min: 1, max: 5 },
      reviewCount: { type: Number, default: 0 },
      contactPhone: { type: String, default: '' },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password helper
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
