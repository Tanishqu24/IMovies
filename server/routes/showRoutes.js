const express = require('express');
const {
  getShows,
  getShowsForMovie,
  getShowById,
  createShow,
  updateShow,
  deleteShow
} = require('../controllers/showController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/movie/:movieId', getShowsForMovie);

router.route('/')
  .get(getShows)
  .post(protect, authorize('admin', 'manager'), createShow);

router.route('/:id')
  .get(getShowById)
  .put(protect, authorize('admin', 'manager'), updateShow)
  .delete(protect, authorize('admin', 'manager'), deleteShow);

module.exports = router;

