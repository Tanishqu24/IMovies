const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },
    description: {
      type: String,
      default: ''
    },
    discountType: {
      type: String,
      enum: ['percentage', 'flat'],
      default: 'percentage'
    },
    discountValue: {
      type: Number,
      required: [true, 'Discount value is required'],
      min: 1
    },
    minimumAmount: {
      type: Number,
      default: 0
    },
    maxDiscount: {
      type: Number,
      default: 500
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required']
    },
    usageLimit: {
      type: Number,
      default: 100
    },
    timesUsed: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Coupon', couponSchema);

