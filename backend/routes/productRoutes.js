const express = require('express');
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getProducts);
router.post('/', protect, authorizeRoles('admin', 'vendor'), createProduct);
router.put('/:id', protect, authorizeRoles('admin', 'vendor'), updateProduct);
router.delete('/:id', protect, authorizeRoles('admin', 'vendor'), deleteProduct);

module.exports = router;
