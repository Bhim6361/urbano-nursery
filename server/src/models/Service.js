const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Service description is required'],
    },
    category: {
      type: String,
      enum: ['Lawn Maintenance', 'Pruning & Trimming', 'Soil & Repotting', 'Plant Doctor & Pest', 'Landscaping & Makeover'],
      default: 'Lawn Maintenance',
    },
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: [0, 'Base price cannot be negative'],
    },
    durationMinutes: {
      type: Number,
      default: 90,
    },
    features: {
      type: [String],
      default: [
        'Experienced & verified garden specialist',
        'Eco-friendly organic treatments',
        'Complete debris cleanup & disposal',
        'Personalized care instructions',
      ],
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1592417817098-8f3d69102a5e?auto=format&fit=crop&w=800&q=80',
    },
    icon: {
      type: String,
      default: 'Scissors',
    },
    isFeatured: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Service', serviceSchema);
