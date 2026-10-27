const Coupon = require('../models/Coupon');

// @desc    Validate coupon code during checkout
// @route   POST /api/coupons/validate
// @access  Private
const validateCoupon = async (req, res, next) => {
  try {
    const { code, orderAmount } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Please provide a coupon code' });
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase().trim(),
      isActive: true
    });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or non-existent coupon code' });
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ success: false, message: 'This coupon has expired' });
    }

    if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: 'Coupon usage limit has been reached' });
    }

    if (orderAmount < coupon.minimumAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${coupon.minimumAmount} required to use this coupon`
      });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((orderAmount * coupon.discountValue) / 100);
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else {
      discount = coupon.discountValue;
    }

    res.json({
      success: true,
      message: 'Coupon applied successfully!',
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: discount
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all coupons (Admin)
// @route   GET /api/coupons
// @access  Public / Private
const getCoupons = async (req, res, next) => {
  try {
    // If public request, return active coupons only
    const query = req.user && req.user.role === 'admin' ? {} : { isActive: true, expiryDate: { $gte: new Date() } };

    const coupons = await Coupon.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: coupons.length, coupons });
  } catch (error) {
    next(error);
  }
};

// @desc    Create coupon
// @route   POST /api/coupons
// @access  Private (Admin)
const createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      coupon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Private (Admin)
const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    res.json({
      success: true,
      message: 'Coupon updated successfully',
      coupon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private (Admin)
const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    res.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateCoupon,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon
};

