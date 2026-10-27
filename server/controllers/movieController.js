const Movie = require('../models/Movie');
const Review = require('../models/Review');

// @desc    Get all movies with search, filter, sort, pagination
// @route   GET /api/movies
// @access  Public
const getMovies = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const query = {};

    // Search query
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { director: searchRegex },
        { cast: searchRegex }
      ];
    }

    // Genre filter
    if (req.query.genre && req.query.genre !== 'all') {
      query.genre = req.query.genre;
    }

    // Language filter
    if (req.query.language && req.query.language !== 'all') {
      query.language = req.query.language;
    }

    // Status filter
    if (req.query.status && req.query.status !== 'all') {
      query.status = req.query.status;
    }

    // Rating filter (minimum rating)
    if (req.query.minRating) {
      query.rating = { $gte: parseFloat(req.query.minRating) };
    }

    // Sort
    let sort = { releaseDate: -1 };
    if (req.query.sortBy) {
      if (req.query.sortBy === 'rating') sort = { rating: -1 };
      else if (req.query.sortBy === 'title') sort = { title: 1 };
      else if (req.query.sortBy === 'releaseDateAsc') sort = { releaseDate: 1 };
      else if (req.query.sortBy === 'releaseDateDesc') sort = { releaseDate: -1 };
    }

    const total = await Movie.countDocuments(query);
    const movies = await Movie.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: movies.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      movies
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured movies for homepage
// @route   GET /api/movies/featured/home
// @access  Public
const getFeaturedMovies = async (req, res, next) => {
  try {
    const nowShowing = await Movie.find({ status: 'now_showing' })
      .sort({ rating: -1, releaseDate: -1 })
      .limit(8);

    const upcoming = await Movie.find({ status: 'upcoming' })
      .sort({ releaseDate: 1 })
      .limit(8);

    const trending = await Movie.find({ status: 'now_showing', rating: { $gte: 7.5 } })
      .sort({ rating: -1 })
      .limit(5);

    const heroMovies = await Movie.find({ status: 'now_showing' })
      .sort({ rating: -1 })
      .limit(3);

    res.json({
      success: true,
      data: {
        hero: heroMovies,
        nowShowing,
        upcoming,
        trending
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single movie
// @route   GET /api/movies/:id
// @access  Public
const getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    // Get recent reviews for this movie
    const reviews = await Review.find({ movieId: movie._id })
      .populate('userId', 'fullName profileImage')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      movie,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new movie
// @route   POST /api/movies
// @access  Private (Admin)
const createMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      movie
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update movie
// @route   PUT /api/movies/:id
// @access  Private (Admin)
const updateMovie = async (req, res, next) => {
  try {
    let movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Movie updated successfully',
      movie
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete movie
// @route   DELETE /api/movies/:id
// @access  Private (Admin)
const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    await Movie.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Movie deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMovies,
  getFeaturedMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
};

