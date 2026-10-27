const express = require('express');
const {
  getTheatres,
  getCities,
  getTheatreById,
  createTheatre,
  updateTheatre,
  deleteTheatre
} = require('../controllers/theatreController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/cities', getCities);

router.route('/')
  .get(getTheatres)
  .post(protect, authorize('admin'), createTheatre);

router.route('/:id')
  .get(getTheatreById)
  .put(protect, authorize('admin', 'manager'), updateTheatre)
  .delete(protect, authorize('admin'), deleteTheatre);

module.exports = router;

