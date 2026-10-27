const express = require('express');
const {
  getScreens,
  getScreenById,
  createScreen,
  updateScreen,
  deleteScreen
} = require('../controllers/screenController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getScreens)
  .post(protect, authorize('admin', 'manager'), createScreen);

router.route('/:id')
  .get(getScreenById)
  .put(protect, authorize('admin', 'manager'), updateScreen)
  .delete(protect, authorize('admin', 'manager'), deleteScreen);

module.exports = router;

