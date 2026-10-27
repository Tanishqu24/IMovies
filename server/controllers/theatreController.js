const Theatre = require('../models/Theatre');
const User = require('../models/User');

// @desc    Get all theatres with city filter, search, pagination
// @route   GET /api/theatres
// @access  Public
const getTheatres = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    // Filter by city
    if (req.query.city && req.query.city !== 'All Cities') {
      query.city = new RegExp(`^${req.query.city}$`, 'i');
    }

    // Filter by status (default active for public)
    if (req.query.status && req.query.status !== 'all') {
      query.status = req.query.status;
    }

    // Search query
    if (req.query.search) {
      query.name = new RegExp(req.query.search, 'i');
    }

    // If theatre manager, restrict to their assigned theatres unless specified otherwise
    if (req.user && req.user.role === 'manager') {
      query.$or = [
        { managerId: req.user._id },
        { _id: { $in: req.user.assignedTheatres || [] } }
      ];
    }

    const total = await Theatre.countDocuments(query);
    const theatres = await Theatre.find(query)
      .populate('managerId', 'fullName email phone')
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: theatres.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      theatres
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get distinct list of cities where theatres are present
// @route   GET /api/theatres/cities
// @access  Public
const getCities = async (req, res, next) => {
  try {
    const cities = await Theatre.distinct('city', { status: 'active' });
    res.json({
      success: true,
      cities: cities.length > 0 ? cities : ['Mumbai', 'Delhi-NCR', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune']
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single theatre
// @route   GET /api/theatres/:id
// @access  Public
const getTheatreById = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id).populate('managerId', 'fullName email phone');
    if (!theatre) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }

    res.json({ success: true, theatre });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new theatre
// @route   POST /api/theatres
// @access  Private (Admin)
const createTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.create(req.body);

    // If managerId was provided, update the manager's assignedTheatres
    if (theatre.managerId) {
      await User.findByIdAndUpdate(theatre.managerId, {
        $addToSet: { assignedTheatres: theatre._id }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Theatre created successfully',
      theatre
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update theatre
// @route   PUT /api/theatres/:id
// @access  Private (Admin, Manager of this theatre)
const updateTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }

    // Role check: If manager, verify ownership
    if (req.user.role === 'manager') {
      const isOwner = String(theatre.managerId) === String(req.user._id) ||
        (req.user.assignedTheatres && req.user.assignedTheatres.some(t => String(t) === String(theatre._id)));
      if (!isOwner) {
        return res.status(403).json({ success: false, message: 'You are not authorized to update this theatre' });
      }
    }

    const oldManagerId = theatre.managerId;
    const updatedTheatre = await Theatre.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('managerId', 'fullName email');

    // Update manager associations if manager changed
    if (req.body.managerId && String(req.body.managerId) !== String(oldManagerId)) {
      if (oldManagerId) {
        await User.findByIdAndUpdate(oldManagerId, { $pull: { assignedTheatres: theatre._id } });
      }
      await User.findByIdAndUpdate(req.body.managerId, { $addToSet: { assignedTheatres: theatre._id } });
    }

    res.json({
      success: true,
      message: 'Theatre updated successfully',
      theatre: updatedTheatre
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete theatre
// @route   DELETE /api/theatres/:id
// @access  Private (Admin)
const deleteTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }

    if (theatre.managerId) {
      await User.findByIdAndUpdate(theatre.managerId, { $pull: { assignedTheatres: theatre._id } });
    }

    await Theatre.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Theatre deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTheatres,
  getCities,
  getTheatreById,
  createTheatre,
  updateTheatre,
  deleteTheatre
};

