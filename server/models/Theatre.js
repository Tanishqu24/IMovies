const mongoose = require('mongoose');

const theatreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Theatre name is required'],
      trim: true,
      index: true
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      index: true
    },
    state: {
      type: String,
      default: 'Maharashtra',
      trim: true
    },
    pincode: {
      type: String,
      trim: true
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    facilities: {
      type: [String],
      default: ['Dolby Atmos', '4K Projection', 'Food & Beverages', 'Parking', 'Recliner Seats']
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

theatreSchema.index({ city: 1, name: 1 });

module.exports = mongoose.model('Theatre', theatreSchema);

