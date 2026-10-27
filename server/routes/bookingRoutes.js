const express = require('express');
const {
  lockSeats,
  unlockSeats,
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/lock-seats', lockSeats);
router.post('/unlock-seats', unlockSeats);
router.post('/', createBooking);
router.get('/my-bookings', getMyBookings);
router.get('/', authorize('admin', 'manager'), getAllBookings);
router.get('/:id', getBookingById);
router.put('/:id/cancel', cancelBooking);

module.exports = router;

