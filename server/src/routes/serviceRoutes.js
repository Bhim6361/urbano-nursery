const express = require('express');
const router = express.Router();
const {
  getServices,
  getService,
  getGardeners,
  getGardenerById,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getServices);
router.get('/gardeners/list', getGardeners);
router.get('/gardeners/:id', getGardenerById);
router.get('/:idOrSlug', getService);

router.post('/', protect, authorize('admin'), createService);
router.put('/:id', protect, authorize('admin'), updateService);
router.delete('/:id', protect, authorize('admin'), deleteService);

module.exports = router;
