const User = require('../models/User');

// @desc    Get all users with search, filter, pagination
// @route   GET /api/users
// @access  Private (Admin)
const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [{ fullName: searchRegex }, { email: searchRegex }, { phone: searchRegex }];
    }

    if (req.query.role && req.query.role !== 'all') {
      query.role = req.query.role;
    }

    if (req.query.status && req.query.status !== 'all') {
      query.isActive = req.query.status === 'active';
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .populate('assignedTheatres', 'name city')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (Admin)
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('assignedTheatres', 'name city');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user (Admin)
// @route   PUT /api/users/:id
// @access  Private (Admin)
const updateUser = async (req, res, next) => {
  try {
    const { fullName, phone, city, role, isActive, assignedTheatres } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Protect against self-deactivation or self-demotion of the primary admin
    if (String(req.user._id) === String(user._id) && role && role !== 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot demote your own admin account' });
    }

    if (fullName) user.fullName = fullName;
    if (phone !== undefined) user.phone = phone;
    if (city) user.city = city;
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    if (assignedTheatres !== undefined) user.assignedTheatres = assignedTheatres;

    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        city: user.city,
        role: user.role,
        isActive: user.isActive,
        assignedTheatres: user.assignedTheatres
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (String(req.user._id) === String(user._id)) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own admin account' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of managers for dropdowns
// @route   GET /api/users/managers/list
// @access  Private (Admin)
const getManagers = async (req, res, next) => {
  try {
    const managers = await User.find({ role: 'manager', isActive: true }).select('fullName email phone');
    res.json({ success: true, managers });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getManagers
};

