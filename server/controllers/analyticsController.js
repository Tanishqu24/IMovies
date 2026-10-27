const User = require('../models/User');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Show = require('../models/Show');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

// @desc    Get admin dashboard stats and charts
// @route   GET /api/analytics/admin
// @access  Private (Admin)
const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMovies = await Movie.countDocuments();
    const totalTheatres = await Theatre.countDocuments();
    const totalShows = await Show.countDocuments();
    const totalBookings = await Booking.countDocuments();

    // Total confirmed revenue
    const revenueAgg = await Booking.aggregate([
      { $match: { bookingStatus: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    // Monthly revenue (past 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const monthlyRevenue = await Booking.aggregate([
      {
        $match: {
          bookingStatus: 'confirmed',
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedMonthly = monthlyRevenue.map(item => ({
      name: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      revenue: item.revenue,
      bookings: item.bookings
    }));

    // Top 5 popular movies
    const topMoviesAgg = await Booking.aggregate([
      { $match: { bookingStatus: 'confirmed' } },
      {
        $group: {
          _id: '$movieId',
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { totalBookings: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'movies',
          localField: '_id',
          foreignField: '_id',
          as: 'movie'
        }
      },
      { $unwind: '$movie' },
      {
        $project: {
          title: '$movie.title',
          poster: '$movie.poster',
          rating: '$movie.rating',
          totalBookings: 1,
          totalRevenue: 1
        }
      }
    ]);

    // Theatre performance
    const theatrePerformance = await Booking.aggregate([
      { $match: { bookingStatus: 'confirmed' } },
      {
        $group: {
          _id: '$theatreId',
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'theatres',
          localField: '_id',
          foreignField: '_id',
          as: 'theatre'
        }
      },
      { $unwind: '$theatre' },
      {
        $project: {
          name: '$theatre.name',
          city: '$theatre.city',
          totalBookings: 1,
          totalRevenue: 1
        }
      }
    ]);

    // Booking status distribution
    const statusDistribution = await Booking.aggregate([
      {
        $group: {
          _id: '$bookingStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent 5 bookings
    const recentBookings = await Booking.find()
      .populate('userId', 'fullName email')
      .populate('movieId', 'title poster')
      .populate('theatreId', 'name city')
      .sort({ createdAt: -1 })
      .limit(6);

    // Recent 5 users
    const recentUsers = await User.find()
      .select('fullName email role createdAt profileImage city')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalMovies,
        totalTheatres,
        totalShows,
        totalBookings,
        totalRevenue
      },
      monthlyRevenue: formattedMonthly,
      topMovies: topMoviesAgg,
      theatrePerformance,
      statusDistribution: statusDistribution.map(s => ({
        name: s._id === 'confirmed' ? 'Confirmed' : 'Cancelled',
        value: s.count
      })),
      recentBookings,
      recentUsers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get theatre manager stats
// @route   GET /api/analytics/manager
// @access  Private (Manager)
const getManagerStats = async (req, res, next) => {
  try {
    const managedTheatres = await Theatre.find({
      $or: [
        { managerId: req.user._id },
        { _id: { $in: req.user.assignedTheatres || [] } }
      ]
    }).select('_id name city');

    const theatreIds = managedTheatres.map(t => t._id);

    const totalShows = await Show.countDocuments({ theatreId: { $in: theatreIds } });
    const totalBookings = await Booking.countDocuments({ theatreId: { $in: theatreIds } });

    const revenueAgg = await Booking.aggregate([
      {
        $match: {
          theatreId: { $in: theatreIds },
          bookingStatus: 'confirmed'
        }
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    const recentBookings = await Booking.find({ theatreId: { $in: theatreIds } })
      .populate('userId', 'fullName email phone')
      .populate('movieId', 'title poster')
      .populate('theatreId', 'name city')
      .populate('screenId', 'screenName')
      .sort({ createdAt: -1 })
      .limit(10);

    const shows = await Show.find({ theatreId: { $in: theatreIds }, status: 'active' })
      .populate('movieId', 'title poster duration')
      .populate('theatreId', 'name')
      .populate('screenId', 'screenName totalSeats')
      .sort({ showDate: 1, startTime: 1 })
      .limit(10);

    res.json({
      success: true,
      managedTheatres,
      stats: {
        theatresCount: managedTheatres.length,
        totalShows,
        totalBookings,
        totalRevenue
      },
      recentBookings,
      upcomingShows: shows
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getManagerStats
};

