const express = require('express');
const {
  getMovies,
  getFeaturedMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
} = require('../controllers/movieController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/featured/home', getFeaturedMovies);

router.route('/')
  .get(getMovies)
  .post(protect, authorize('admin'), createMovie);

router.route('/:id')
  .get(getMovieById)
  .put(protect, authorize('admin'), updateMovie)
  .delete(protect, authorize('admin'), deleteMovie);

module.exports = router;

