const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    showId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show',
      required: true,
      index: true
    },
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true
    },
    theatreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: true
    },
    screenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Screen',
      required: true
    },
    selectedSeats: [
      {
        seatId: { type: String, required: true },
        category: { type: String, enum: ['Regular', 'Premium', 'VIP'], required: true },
        price: { type: Number, required: true }
      }
    ],
    subtotal: {
      type: Number,
      required: true
    },
    convenienceFee: {
      type: Number,
      default: 30
    },
    tax: {
      type: Number,
      default: 18
    },
    discountAmount: {
      type: Number,
      default: 0
    },
    couponCode: {
      type: String,
      default: ''
    },
    totalAmount: {
      type: Number,
      required: true
    },
    bookingStatus: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
      index: true
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'refunded', 'pending', 'failed'],
      default: 'paid'
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment'
    },
    bookingDate: {
      type: Date,
      default: Date.now
    },
    cancellationDate: {
      type: Date
    },
    refundAmount: {
      type: Number,
      default: 0
    },
    qrCodeData: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

bookingSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);

