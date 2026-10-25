const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters'],
    },
    botanicalName: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    shortDescription: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number,
      default: function () {
        return Math.round(this.price * 1.25);
      },
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 10,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required'],
    },
    images: {
      type: [String],
      default: [
        'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
      ],
    },
    indoorOutdoor: {
      type: String,
      enum: ['indoor', 'outdoor', 'both'],
      default: 'both',
    },
    careGuide: {
      light: {
        type: String,
        default: 'Bright indirect sunlight',
      },
      water: {
        type: String,
        default: 'Water when top 1-2 inches of soil feel dry',
      },
      soil: {
        type: String,
        default: 'Well-draining nutrient-rich potting soil',
      },
      temperature: {
        type: String,
        default: '18°C - 32°C',
      },
      humidity: {
        type: String,
        default: 'Moderate to high (50-60%)',
      },
    },
    difficulty: {
      type: String,
      enum: ['Beginner Friendly', 'Intermediate', 'Expert'],
      default: 'Beginner Friendly',
    },
    nursery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Product vendor/nursery reference is required'],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    ratingsAverage: {
      type: Number,
      default: 4.8,
      min: [1, 'Rating must be at least 1.0'],
      max: [5, 'Rating cannot exceed 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Virtual index for searching
productSchema.index({ name: 'text', botanicalName: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
