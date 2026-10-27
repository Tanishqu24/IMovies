const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

// @desc    Initiate/create simulated payment order
// @route   POST /api/payments/create
// @access  Private
const createPaymentOrder = async (req, res, next) => {
  try {
    const { amount, bookingData } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid amount is required' });
    }

    // Generate mock order details (matches Razorpay order structure for seamless future upgrade)
    const orderId = `order_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    res.json({
      success: true,
      order: {
        id: orderId,
        amount: Math.round(amount * 100), // amount in paise (like Razorpay)
        currency: 'INR',
        receipt: `receipt_${Date.now()}`
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify payment and return confirmation status
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = async (req, res, next) => {
  try {
    const { paymentId, orderId, signature, paymentMethod } = req.body;

    // Simulated verification logic
    // In production with Razorpay: crypto.createHmac('sha256', secret).update(orderId + '|' + paymentId).digest('hex') === signature
    const isValid = Boolean(paymentId && orderId);

    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      transactionId: paymentId
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all payments (Admin)
// @route   GET /api/payments
// @access  Private (Admin)
const getAllPayments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 15;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.method && req.query.method !== 'all') {
      query.paymentMethod = req.query.method;
    }

    if (req.query.status && req.query.status !== 'all') {
      query.paymentStatus = req.query.status;
    }

    if (req.query.search) {
      query.transactionId = new RegExp(req.query.search, 'i');
    }

    const total = await Payment.countDocuments(query);
    const payments = await Payment.find(query)
      .populate('userId', 'fullName email')
      .populate({
        path: 'bookingId',
        select: 'bookingId totalAmount',
        populate: { path: 'movieId', select: 'title' }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: payments.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      payments
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  getAllPayments
};

