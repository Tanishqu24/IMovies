const Booking = require('../models/Booking');
const Show = require('../models/Show');
const Payment = require('../models/Payment');
const Coupon = require('../models/Coupon');
const Notification = require('../models/Notification');
const seatLockService = require('../services/seatLockService');

// Generate unique booking ID
const generateBookingId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'IM-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// @desc    Temporarily lock seats for checkout
// @route   POST /api/bookings/lock-seats
// @access  Private
const lockSeats = async (req, res, next) => {
  try {
    const { showId, seatIds } = req.body;
    const userId = req.user._id;

    if (!showId || !seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide showId and seatIds' });
    }

    // Verify seats are not already booked in database
    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    const alreadyBooked = seatIds.some(seat => show.bookedSeats.includes(seat));
    if (alreadyBooked) {
      return res.status(400).json({ success: false, message: 'One or more selected seats are already booked' });
    }

    const io = req.app.get('io');
    const lockResult = seatLockService.lockSeats(showId, seatIds, userId, io);

    if (!lockResult.success) {
      return res.status(409).json({ success: false, message: lockResult.message });
    }

    res.json({
      success: true,
      message: 'Seats locked for checkout',
      expiresAt: lockResult.expiresAt
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unlock temporarily locked seats
// @route   POST /api/bookings/unlock-seats
// @access  Private
const unlockSeats = async (req, res, next) => {
  try {
    const { showId, seatIds } = req.body;
    const userId = req.user._id;

    if (!showId || !seatIds) {
      return res.status(400).json({ success: false, message: 'Invalid showId or seatIds' });
    }

    const io = req.app.get('io');
    seatLockService.unlockSeats(showId, seatIds, userId, io);

    res.json({ success: true, message: 'Seats unlocked' });
  } catch (error) {
    next(error);
  }
};

// @desc    Create and confirm booking with simulated payment
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const { showId, selectedSeats, couponCode, paymentMethod } = req.body;
    const userId = req.user._id;

    if (!showId || !selectedSeats || selectedSeats.length === 0) {
      return res.status(400).json({ success: false, message: 'Show and seat selections are required' });
    }

    if (selectedSeats.length > 8) {
      return res.status(400).json({ success: false, message: 'Maximum 8 seats allowed per booking' });
    }

    const show = await Show.findById(showId)
      .populate('movieId')
      .populate('theatreId')
      .populate('screenId');

    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    const seatIdList = selectedSeats.map(s => s.seatId);

    // 1. Atomic check: verify seats not already booked
    const conflictSeats = seatIdList.filter(s => show.bookedSeats.includes(s));
    if (conflictSeats.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Seats ${conflictSeats.join(', ')} were just booked by another customer`
      });
    }

    // 2. Check if seat is locked by someone else
    for (const seatId of seatIdList) {
      if (seatLockService.isSeatLockedByOther(showId, seatId, userId)) {
        return res.status(409).json({
          success: false,
          message: `Seat ${seatId} is currently reserved by another customer`
        });
      }
    }

    // 3. Calculate pricing
    let subtotal = 0;
    selectedSeats.forEach(seat => {
      // Use show pricing if category matches
      const price = show.seatPricing[seat.category] || seat.price || 220;
      seat.price = price;
      subtotal += price;
    });

    const convenienceFee = Math.round(30 * selectedSeats.length);
    const tax = Math.round(convenienceFee * 0.18); // 18% GST on convenience fee

    let discountAmount = 0;
    let appliedCoupon = null;

    if (couponCode) {
      appliedCoupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        expiryDate: { $gte: new Date() }
      });

      if (appliedCoupon && subtotal >= appliedCoupon.minimumAmount) {
        if (appliedCoupon.discountType === 'percentage') {
          discountAmount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
          if (appliedCoupon.maxDiscount) {
            discountAmount = Math.min(discountAmount, appliedCoupon.maxDiscount);
          }
        } else {
          discountAmount = appliedCoupon.discountValue;
        }

        // Increment coupon usage
        appliedCoupon.timesUsed += 1;
        await appliedCoupon.save();
      }
    }

    const totalAmount = Math.max(0, subtotal + convenienceFee + tax - discountAmount);
    const bookingId = generateBookingId();
    const transactionId = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 4. Atomically add booked seats to show
    show.bookedSeats.push(...seatIdList);
    await show.save();

    // 5. Create Booking record
    const booking = await Booking.create({
      bookingId,
      userId,
      showId,
      movieId: show.movieId._id,
      theatreId: show.theatreId._id,
      screenId: show.screenId._id,
      selectedSeats,
      subtotal,
      convenienceFee,
      tax,
      discountAmount,
      couponCode: couponCode || '',
      totalAmount,
      bookingStatus: 'confirmed',
      paymentStatus: 'paid',
      qrCodeData: JSON.stringify({
        bookingId,
        movie: show.movieId.title,
        theatre: show.theatreId.name,
        date: show.showDate,
        time: show.startTime,
        seats: seatIdList
      })
    });

    // 6. Create Payment record
    const payment = await Payment.create({
      bookingId: booking._id,
      userId,
      amount: totalAmount,
      paymentMethod: paymentMethod || 'upi',
      transactionId,
      paymentStatus: 'success',
      paymentDate: new Date()
    });

    booking.paymentId = payment._id;
    await booking.save();

    // 7. Release in-memory locks
    const io = req.app.get('io');
    seatLockService.unlockSeats(showId, seatIdList, 'SYSTEM', io);

    // 8. Create user notification
    await Notification.create({
      userId,
      title: 'Booking Confirmed!',
      message: `Your booking ${bookingId} for ${show.movieId.title} on ${show.showDate} at ${show.startTime} is confirmed.`,
      type: 'booking'
    });

    // 9. Emit real-time updates via Socket.IO
    if (io) {
      io.to(`show_${String(showId)}`).emit('seatStatusChanged', {
        showId: String(showId),
        bookedSeats: show.bookedSeats,
        lockedSeats: seatLockService.getLockedSeats(showId)
      });
      io.emit('newBookingCreated', {
        theatreId: show.theatreId._id,
        bookingId
      });
    }

    const fullBooking = await Booking.findById(booking._id)
      .populate('movieId')
      .populate('theatreId')
      .populate('screenId')
      .populate('paymentId');

    res.status(201).json({
      success: true,
      message: 'Tickets booked successfully!',
      booking: fullBooking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's personal bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('movieId')
      .populate('theatreId')
      .populate('screenId')
      .populate('paymentId')
      .populate('showId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('movieId')
      .populate('theatreId')
      .populate('screenId')
      .populate('paymentId')
      .populate('userId', 'fullName email phone');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Role check: customer can only view their own booking
    if (req.user.role === 'customer' && String(booking.userId._id) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this booking' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking & refund
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Customer can only cancel their own booking
    if (req.user.role === 'customer' && String(booking.userId) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Unauthorized to cancel this booking' });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
    }

    // Free up seats from Show
    const show = await Show.findById(booking.showId);
    if (show) {
      const seatsToFree = booking.selectedSeats.map(s => s.seatId);
      show.bookedSeats = show.bookedSeats.filter(s => !seatsToFree.includes(s));
      await show.save();

      const io = req.app.get('io');
      if (io) {
        io.to(`show_${String(show._id)}`).emit('seatStatusChanged', {
          showId: String(show._id),
          bookedSeats: show.bookedSeats,
          lockedSeats: seatLockService.getLockedSeats(show._id)
        });
      }
    }

    // Process refund (e.g., 90% refund, 10% cancellation charge)
    const refundAmount = Math.round(booking.totalAmount * 0.9);
    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = 'refunded';
    booking.cancellationDate = new Date();
    booking.refundAmount = refundAmount;
    await booking.save();

    // Update payment record if exists
    if (booking.paymentId) {
      await Payment.findByIdAndUpdate(booking.paymentId, { paymentStatus: 'refunded' });
    }

    // Notification
    await Notification.create({
      userId: booking.userId,
      title: 'Booking Cancelled',
      message: `Your booking ${booking.bookingId} has been cancelled. Refund of ₹${refundAmount} has been initiated.`,
      type: 'cancellation'
    });

    res.json({
      success: true,
      message: 'Booking cancelled successfully. Refund initiated.',
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin/Manager)
// @route   GET /api/bookings
// @access  Private (Admin, Manager)
const getAllBookings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 15;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.status && req.query.status !== 'all') {
      query.bookingStatus = req.query.status;
    }

    if (req.query.search) {
      query.bookingId = new RegExp(req.query.search, 'i');
    }

    // If manager, filter by manager's theatres
    if (req.user.role === 'manager') {
      const Theatre = require('../models/Theatre');
      const managedTheatres = await Theatre.find({
        $or: [
          { managerId: req.user._id },
          { _id: { $in: req.user.assignedTheatres || [] } }
        ]
      }).select('_id');
      query.theatreId = { $in: managedTheatres.map(t => t._id) };
    }

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('userId', 'fullName email phone')
      .populate('movieId', 'title poster')
      .populate('theatreId', 'name city')
      .populate('screenId', 'screenName')
      .populate('paymentId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: bookings.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      bookings
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  lockSeats,
  unlockSeats,
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings
};

