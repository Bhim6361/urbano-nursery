const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getPendingVendors,
  updateVendorStatus,
  getAllUsers,
  updateUser,
  getAllOrders,
  getAllBookings,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes here are restricted to Admin only
router.use(protect, authorize('admin'));

router.get('/dashboard-stats', getDashboardStats);
router.get('/pending-vendors', getPendingVendors);
router.put('/vendors/:id/status', updateVendorStatus);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.get('/orders', getAllOrders);
router.get('/bookings', getAllBookings);

module.exports = router;
