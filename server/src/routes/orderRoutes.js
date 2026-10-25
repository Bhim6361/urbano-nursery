const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
  getVendorOrders,
} = require('../controllers/orderController');
const {
  protect,
  authorize,
  checkApprovedVendor,
} = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get(
  '/vendor/incoming',
  protect,
  authorize('nursery', 'admin'),
  checkApprovedVendor,
  getVendorOrders
);
router.get('/:id', protect, getOrderById);
router.put('/:id/cancel', protect, cancelOrder);
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;
