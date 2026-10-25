const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  resolveComplaint,
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, createComplaint);
router.get('/my-complaints', protect, getMyComplaints);
router.get('/admin/all', protect, authorize('admin'), getAllComplaints);
router.put('/:id/resolve', protect, authorize('admin'), resolveComplaint);

module.exports = router;
