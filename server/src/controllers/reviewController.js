const Review = require('../models/Review');
const Product = require('../models/Product');
const User = require('../models/User');

// Helper to update product average rating
const updateProductRating = async (productId) => {
  const reviews = await Review.find({
    targetType: 'Product',
    targetId: productId,
  });

  if (reviews.length === 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 5,
      ratingsQuantity: 0,
    });
    return;
  }

  const avg =
    reviews.reduce((sum, rev) => sum + rev.rating, 0) / reviews.length;
  await Product.findByIdAndUpdate(productId, {
    ratingsAverage: Math.round(avg * 10) / 10,
    ratingsQuantity: reviews.length,
  });
};

// @desc    Get reviews for a product, service, or gardener
// @route   GET /api/reviews
// @access  Public
const getReviews = async (req, res, next) => {
  try {
    const { targetType, targetId } = req.query;
    const query = {};

    if (targetType) query.targetType = targetType;
    if (targetId) query.targetId = targetId;

    const reviews = await Review.find(query)
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res, next) => {
  try {
    const { targetType, targetId, rating, title, comment } = req.body;

    if (!targetType || !targetId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide target, rating, and review comment',
      });
    }

    // Check if user already reviewed this target
    const existingReview = await Review.findOne({
      user: req.user._id,
      targetType,
      targetId,
    });

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.title = title || existingReview.title;
      existingReview.comment = comment;
      await existingReview.save();

      if (targetType === 'Product') {
        await updateProductRating(targetId);
      }

      const populated = await Review.findById(existingReview._id).populate(
        'user',
        'name avatar'
      );

      return res.status(200).json({
        success: true,
        message: 'Review updated successfully',
        review: populated,
      });
    }

    const review = await Review.create({
      user: req.user._id,
      targetType,
      targetId,
      rating: Number(rating),
      title: title || '',
      comment,
      isVerifiedPurchase: true,
    });

    if (targetType === 'Product') {
      await updateProductRating(targetId);
    }

    const populatedReview = await Review.findById(review._id).populate(
      'user',
      'name avatar'
    );

    res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been submitted.',
      review: populatedReview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private (Owner or Admin)
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review',
      });
    }

    const targetType = review.targetType;
    const targetId = review.targetId;

    await review.deleteOne();

    if (targetType === 'Product') {
      await updateProductRating(targetId);
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReviews,
  createReview,
  deleteReview,
};
