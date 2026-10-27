const Screen = require('../models/Screen');
const Theatre = require('../models/Theatre');

// Helper to generate a realistic cinema seat layout if not provided
const generateDefaultSeatLayout = () => {
  const layout = [];
  const rowConfigs = [
    { rowLetter: 'A', category: 'VIP', price: 500, seatCount: 8 },
    { rowLetter: 'B', category: 'VIP', price: 500, seatCount: 8 },
    { rowLetter: 'C', category: 'Premium', price: 320, seatCount: 10 },
    { rowLetter: 'D', category: 'Premium', price: 320, seatCount: 10 },
    { rowLetter: 'E', category: 'Premium', price: 320, seatCount: 10 },
    { rowLetter: 'F', category: 'Regular', price: 220, seatCount: 12 },
    { rowLetter: 'G', category: 'Regular', price: 220, seatCount: 12 },
    { rowLetter: 'H', category: 'Regular', price: 220, seatCount: 12 }
  ];

  rowConfigs.forEach(rc => {
    const seats = [];
    for (let i = 1; i <= rc.seatCount; i++) {
      seats.push({
        seatNumber: i,
        seatId: `${rc.rowLetter}${i}`,
        isAvailable: true
      });
    }
    layout.push({
      rowLetter: rc.rowLetter,
      category: rc.category,
      basePrice: rc.price,
      seats
    });
  });

  return layout;
};

// @desc    Get screens (filter by theatreId)
// @route   GET /api/screens
// @access  Public / Protected
const getScreens = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.theatreId) {
      query.theatreId = req.query.theatreId;
    }

    // If manager, verify they have access to the theatre
    if (req.user && req.user.role === 'manager' && !query.theatreId) {
      const managedTheatres = await Theatre.find({
        $or: [
          { managerId: req.user._id },
          { _id: { $in: req.user.assignedTheatres || [] } }
        ]
      }).select('_id');
      query.theatreId = { $in: managedTheatres.map(t => t._id) };
    }

    const screens = await Screen.find(query).populate('theatreId', 'name city address');
    res.json({ success: true, count: screens.length, screens });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single screen
// @route   GET /api/screens/:id
// @access  Public
const getScreenById = async (req, res, next) => {
  try {
    const screen = await Screen.findById(req.params.id).populate('theatreId', 'name city address');
    if (!screen) {
      return res.status(404).json({ success: false, message: 'Screen not found' });
    }
    res.json({ success: true, screen });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new screen
// @route   POST /api/screens
// @access  Private (Admin, Manager)
const createScreen = async (req, res, next) => {
  try {
    const { theatreId, screenName, screenType, seatLayout, totalSeats } = req.body;

    const theatre = await Theatre.findById(theatreId);
    if (!theatre) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }

    // Authorization check for manager
    if (req.user.role === 'manager') {
      const isOwner = String(theatre.managerId) === String(req.user._id) ||
        (req.user.assignedTheatres && req.user.assignedTheatres.some(t => String(t) === String(theatre._id)));
      if (!isOwner) {
        return res.status(403).json({ success: false, message: 'Not authorized to add screens to this theatre' });
      }
    }

    const layout = seatLayout && seatLayout.length > 0 ? seatLayout : generateDefaultSeatLayout();
    const countSeats = layout.reduce((acc, row) => acc + (row.seats ? row.seats.length : 0), 0);

    const screen = await Screen.create({
      theatreId,
      screenName,
      screenType: screenType || '4K Dolby Atmos',
      seatLayout: layout,
      totalSeats: totalSeats || countSeats || 82,
      seatCategories: [
        { name: 'Regular', basePath: 220 },
        { name: 'Premium', basePath: 320 },
        { name: 'VIP', basePath: 500 }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Screen created successfully',
      screen
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update screen
// @route   PUT /api/screens/:id
// @access  Private (Admin, Manager)
const updateScreen = async (req, res, next) => {
  try {
    const screen = await Screen.findById(req.params.id);
    if (!screen) {
      return res.status(404).json({ success: false, message: 'Screen not found' });
    }

    if (req.user.role === 'manager') {
      const theatre = await Theatre.findById(screen.theatreId);
      const isOwner = String(theatre.managerId) === String(req.user._id) ||
        (req.user.assignedTheatres && req.user.assignedTheatres.some(t => String(t) === String(theatre._id)));
      if (!isOwner) {
        return res.status(403).json({ success: false, message: 'Not authorized to modify this screen' });
      }
    }

    const updated = await Screen.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('theatreId', 'name city');

    res.json({
      success: true,
      message: 'Screen updated successfully',
      screen: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete screen
// @route   DELETE /api/screens/:id
// @access  Private (Admin, Manager)
const deleteScreen = async (req, res, next) => {
  try {
    const screen = await Screen.findById(req.params.id);
    if (!screen) {
      return res.status(404).json({ success: false, message: 'Screen not found' });
    }

    if (req.user.role === 'manager') {
      const theatre = await Theatre.findById(screen.theatreId);
      const isOwner = String(theatre.managerId) === String(req.user._id) ||
        (req.user.assignedTheatres && req.user.assignedTheatres.some(t => String(t) === String(theatre._id)));
      if (!isOwner) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this screen' });
      }
    }

    await Screen.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Screen deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getScreens,
  getScreenById,
  createScreen,
  updateScreen,
  deleteScreen
};

