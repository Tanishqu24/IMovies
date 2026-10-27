const express = require('express');
const {
  createPaymentOrder,
  verifyPayment,
  getAllPayments
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/create', createPaymentOrder);
router.post('/verify', verifyPayment);
router.get('/', authorize('admin'), getAllPayments);

module.exports = router;

