const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getGardenerBookings,
  getBookingById,
  updateBookingStatus,
} = require('../controllers/bookingController');
const {
  protect,
  authorize,
  checkApprovedVendor,
} = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get(
  '/gardener/incoming',
  protect,
  authorize('gardener', 'admin'),
  checkApprovedVendor,
  getGardenerBookings
);
router.get('/:id', protect, getBookingById);
router.put('/:id/status', protect, updateBookingStatus);

module.exports = router;
