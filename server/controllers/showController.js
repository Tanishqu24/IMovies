const Show = require('../models/Show');
const Theatre = require('../models/Theatre');
const Screen = require('../models/Screen');
const Movie = require('../models/Movie');
const seatLockService = require('../services/seatLockService');

// @desc    Get shows with filters
// @route   GET /api/shows
// @access  Public
const getShows = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.movieId) query.movieId = req.query.movieId;
    if (req.query.theatreId) query.theatreId = req.query.theatreId;
    if (req.query.showDate) query.showDate = req.query.showDate;
    if (req.query.status && req.query.status !== 'all') query.status = req.query.status;

    // Filter by city: need to query theatres first if city provided
    if (req.query.city && req.query.city !== 'All Cities') {
      const theatresInCity = await Theatre.find({
        city: new RegExp(`^${req.query.city}$`, 'i'),
        status: 'active'
      }).select('_id');
      query.theatreId = { $in: theatresInCity.map(t => t._id) };
    }

    // If manager, only their theatres
    if (req.user && req.user.role === 'manager') {
      const managedTheatres = await Theatre.find({
        $or: [
          { managerId: req.user._id },
          { _id: { $in: req.user.assignedTheatres || [] } }
        ]
      }).select('_id');
      query.theatreId = { $in: managedTheatres.map(t => t._id) };
    }

    const total = await Show.countDocuments(query);
    const shows = await Show.find(query)
      .populate('movieId', 'title poster backdrop duration genre language rating')
      .populate('theatreId', 'name city address facilities')
      .populate('screenId', 'screenName screenType totalSeats')
      .sort({ showDate: 1, startTime: 1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: shows.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      shows
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get shows grouped by theatre for a movie and date (for Movie Details page)
// @route   GET /api/shows/movie/:movieId
// @access  Public
const getShowsForMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const { date, city } = req.query;

    const query = {
      movieId,
      status: 'active'
    };

    if (date) {
      query.showDate = date;
    } else {
      // Default to today
      const today = new Date().toISOString().split('T')[0];
      query.showDate = today;
    }

    // Filter by city if provided
    let theatreFilter = { status: 'active' };
    if (city && city !== 'All Cities') {
      theatreFilter.city = new RegExp(`^${city}$`, 'i');
    }

    const theatresInCity = await Theatre.find(theatreFilter).select('_id');
    query.theatreId = { $in: theatresInCity.map(t => t._id) };

    const shows = await Show.find(query)
      .populate('theatreId', 'name address city facilities')
      .populate('screenId', 'screenName screenType totalSeats')
      .sort({ startTime: 1 });

    // Group shows by theatre
    const theatreMap = {};

    shows.forEach(show => {
      if (!show.theatreId) return;
      const tId = String(show.theatreId._id);
      if (!theatreMap[tId]) {
        theatreMap[tId] = {
          theatre: show.theatreId,
          shows: []
        };
      }
      theatreMap[tId].shows.push({
        _id: show._id,
        screenId: show.screenId,
        showDate: show.showDate,
        startTime: show.startTime,
        endTime: show.endTime,
        seatPricing: show.seatPricing,
        availableSeatsCount: show.screenId ? (show.screenId.totalSeats - show.bookedSeats.length) : 0,
        totalSeats: show.screenId ? show.screenId.totalSeats : 80
      });
    });

    res.json({
      success: true,
      date: query.showDate,
      theatres: Object.values(theatreMap)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single show with seat layout and realtime locked/booked status
// @route   GET /api/shows/:id
// @access  Public
const getShowById = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movieId')
      .populate('theatreId')
      .populate('screenId');

    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    // Get locked seats from in-memory service
    const lockedSeats = seatLockService.getLockedSeats(show._id);

    res.json({
      success: true,
      show,
      bookedSeats: show.bookedSeats,
      lockedSeats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create show
// @route   POST /api/shows
// @access  Private (Admin, Manager)
const createShow = async (req, res, next) => {
  try {
    const { movieId, theatreId, screenId, showDate, startTime, endTime, seatPricing } = req.body;

    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });

    const theatre = await Theatre.findById(theatreId);
    if (!theatre) return res.status(404).json({ success: false, message: 'Theatre not found' });

    const screen = await Screen.findById(screenId);
    if (!screen) return res.status(404).json({ success: false, message: 'Screen not found' });

    // Authorization check for manager
    if (req.user.role === 'manager') {
      const isOwner = String(theatre.managerId) === String(req.user._id) ||
        (req.user.assignedTheatres && req.user.assignedTheatres.some(t => String(t) === String(theatre._id)));
      if (!isOwner) {
        return res.status(403).json({ success: false, message: 'Not authorized to schedule shows for this theatre' });
      }
    }

    // Check for show collision on the same screen at the same date and time
    const existing = await Show.findOne({
      screenId,
      showDate,
      startTime,
      status: 'active'
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A show is already scheduled on this screen at this date and time'
      });
    }

    const show = await Show.create({
      movieId,
      theatreId,
      screenId,
      showDate,
      startTime,
      endTime: endTime || '',
      seatPricing: seatPricing || { Regular: 220, Premium: 320, VIP: 500 },
      bookedSeats: []
    });

    const populated = await Show.findById(show._id)
      .populate('movieId', 'title poster')
      .populate('theatreId', 'name city')
      .populate('screenId', 'screenName');

    res.status(201).json({
      success: true,
      message: 'Show scheduled successfully',
      show: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update show
// @route   PUT /api/shows/:id
// @access  Private (Admin, Manager)
const updateShow = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id);
    if (!show) return res.status(404).json({ success: false, message: 'Show not found' });

    if (req.user.role === 'manager') {
      const theatre = await Theatre.findById(show.theatreId);
      const isOwner = String(theatre.managerId) === String(req.user._id) ||
        (req.user.assignedTheatres && req.user.assignedTheatres.some(t => String(t) === String(theatre._id)));
      if (!isOwner) {
        return res.status(403).json({ success: false, message: 'Not authorized to modify this show' });
      }
    }

    const updated = await Show.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('movieId', 'title poster').populate('theatreId', 'name city').populate('screenId', 'screenName');

    res.json({
      success: true,
      message: 'Show updated successfully',
      show: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete show
// @route   DELETE /api/shows/:id
// @access  Private (Admin, Manager)
const deleteShow = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id);
    if (!show) return res.status(404).json({ success: false, message: 'Show not found' });

    if (req.user.role === 'manager') {
      const theatre = await Theatre.findById(show.theatreId);
      const isOwner = String(theatre.managerId) === String(req.user._id) ||
        (req.user.assignedTheatres && req.user.assignedTheatres.some(t => String(t) === String(theatre._id)));
      if (!isOwner) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this show' });
      }
    }

    // If bookings already exist, prevent deletion or cancel show
    if (show.bookedSeats && show.bookedSeats.length > 0) {
      show.status = 'cancelled';
      await show.save();
      return res.json({ success: true, message: 'Show has existing bookings, marked as cancelled instead' });
    }

    await Show.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Show deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getShows,
  getShowsForMovie,
  getShowById,
  createShow,
  updateShow,
  deleteShow
};

