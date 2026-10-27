const mongoose = require('mongoose');

const showSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
      index: true
    },
    theatreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: true,
      index: true
    },
    screenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Screen',
      required: true
    },
    showDate: {
      type: String, // YYYY-MM-DD
      required: true,
      index: true
    },
    startTime: {
      type: String, // e.g. "10:30 AM", "02:15 PM", "06:45 PM", "10:00 PM"
      required: true
    },
    endTime: {
      type: String,
      default: ''
    },
    seatPricing: {
      Regular: { type: Number, default: 220 },
      Premium: { type: Number, default: 320 },
      VIP: { type: Number, default: 500 }
    },
    bookedSeats: {
      type: [String], // Array of seatIds like ["A1", "A2", "B6"]
      default: []
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'completed'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

showSchema.index({ theatreId: 1, showDate: 1 });
showSchema.index({ movieId: 1, showDate: 1 });

module.exports = mongoose.model('Show', showSchema);

