const Review = require('../models/Review');
const Movie = require('../models/Movie');

// Helper to recalculate average rating for a movie
const recalculateMovieRating = async (movieId) => {
  const stats = await Review.aggregate([
    { $match: { movieId } },
    {
      $group: {
        _id: '$movieId',
        avgRating: { $avg: '$rating' },
        numReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await Movie.findByIdAndUpdate(movieId, {
      rating: parseFloat(stats[0].avgRating.toFixed(1)),
      ratingCount: stats[0].numReviews
    });
  } else {
    await Movie.findByIdAndUpdate(movieId, {
      rating: 0,
      ratingCount: 0
    });
  }
};

// @desc    Get reviews (filter by movieId or all for admin)
// @route   GET /api/reviews
// @access  Public
const getReviews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.movieId) query.movieId = req.query.movieId;

    const total = await Review.countDocuments(query);
    const reviews = await Review.find(query)
      .populate('userId', 'fullName profileImage email')
      .populate('movieId', 'title poster')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: reviews.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res, next) => {
  try {
    const { movieId, rating, comment } = req.body;
    const userId = req.user._id;

    if (!movieId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide movie, rating, and review comment' });
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    // Check if user already reviewed
    const existing = await Review.findOne({ movieId, userId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this movie. You can edit your existing review.' });
    }

    const review = await Review.create({
      userId,
      movieId,
      rating: Number(rating),
      comment
    });

    await recalculateMovieRating(movie._id);

    const populated = await Review.findById(review._id)
      .populate('userId', 'fullName profileImage');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (String(review.userId) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this review' });
    }

    const { rating, comment } = req.body;
    if (rating) review.rating = Number(rating);
    if (comment) review.comment = comment;

    await review.save();
    await recalculateMovieRating(review.movieId);

    const updated = await Review.findById(review._id).populate('userId', 'fullName profileImage');

    res.json({
      success: true,
      message: 'Review updated successfully',
      review: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (String(review.userId) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    const movieId = review.movieId;
    await Review.findByIdAndDelete(req.params.id);
    await recalculateMovieRating(movieId);

    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReviews,
  createReview,
  updateReview,
  deleteReview
};

