const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
      index: true
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required (1-10)'],
      min: 1,
      max: 10
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    }
  },
  {
    timestamps: true
  }
);

reviewSchema.index({ movieId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);

