const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
} = require('../controllers/productController');
const {
  protect,
  authorize,
  checkApprovedVendor,
} = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.get(
  '/vendor/my-products',
  protect,
  authorize('nursery', 'admin'),
  checkApprovedVendor,
  getMyProducts
);
router.get('/:id', getProductById);
router.post(
  '/',
  protect,
  authorize('nursery', 'admin'),
  checkApprovedVendor,
  createProduct
);
router.put(
  '/:id',
  protect,
  authorize('nursery', 'admin'),
  checkApprovedVendor,
  updateProduct
);
router.delete(
  '/:id',
  protect,
  authorize('nursery', 'admin'),
  checkApprovedVendor,
  deleteProduct
);

module.exports = router;
