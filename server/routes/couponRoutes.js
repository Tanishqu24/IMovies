const express = require('express');
const {
  validateCoupon,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon
} = require('../controllers/couponController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/validate', protect, validateCoupon);
router.get('/', getCoupons);

router.post('/', protect, authorize('admin'), createCoupon);
router.put('/:id', protect, authorize('admin'), updateCoupon);
router.delete('/:id', protect, authorize('admin'), deleteCoupon);

module.exports = router;

