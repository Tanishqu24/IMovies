const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: Number,
    required: true
  },
  seatId: {
    type: String, // e.g. "A1", "A2", "B5"
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, { _id: false });

const rowSchema = new mongoose.Schema({
  rowLetter: {
    type: String,
    required: true // "A", "B", "C"...
  },
  category: {
    type: String,
    enum: ['Regular', 'Premium', 'VIP'],
    default: 'Regular'
  },
  basePrice: {
    type: Number,
    default: 200
  },
  seats: [seatSchema]
}, { _id: false });

const screenSchema = new mongoose.Schema(
  {
    theatreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: true,
      index: true
    },
    screenName: {
      type: String,
      required: [true, 'Screen name is required'],
      trim: true
    },
    screenType: {
      type: String,
      default: '4K Dolby Atmos',
      trim: true
    },
    totalSeats: {
      type: Number,
      required: true,
      default: 80
    },
    seatLayout: [rowSchema],
    seatCategories: [
      {
        name: { type: String, enum: ['Regular', 'Premium', 'VIP'] },
        basePrice: { type: Number, default: 200 }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Screen', screenSchema);

