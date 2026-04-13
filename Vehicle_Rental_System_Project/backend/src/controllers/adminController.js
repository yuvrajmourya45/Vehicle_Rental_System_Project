// ============ Admin Controller ============
// Handles all admin operations

const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

// Get dashboard statistics
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalOwners, totalVehicles, totalRevenue] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'owner' }),
      Vehicle.countDocuments(),
      Booking.aggregate([
        { $match: { status: 'approved' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
    ]);

    res.json({
      totalUsers,
      totalOwners,
      totalVehicles,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    next(error);
  }
};

// Get users by role (reusable function)
const getUsersByRole = (role) => async (req, res, next) => {
  try {
    const query = { role };
    if (role === 'user') query.isDeleted = false;
    
    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// Get all users
exports.getAllUsers = getUsersByRole('user');

// Get all owners
exports.getAllOwners = getUsersByRole('owner');

// Get user booking history
exports.getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.params.id })
      .populate('vehicle', 'name brand model')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// Delete user (soft delete)
exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Update user/owner status
const updateUserStatus = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.updateUserStatus = updateUserStatus;
exports.updateOwnerStatus = updateUserStatus;

// Verify vehicle
exports.verifyVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(vehicle);
  } catch (error) {
    next(error);
  }
};

// Get monthly revenue reports
exports.getReports = async (req, res, next) => {
  try {
    const monthlyRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          revenue: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ monthlyRevenue });
  } catch (error) {
    next(error);
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate('vehicle user owner', 'name');
    
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    next(error);
  }
};

// Refund booking
exports.refundBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled', paymentStatus: 'refunded' },
      { new: true }
    );
    
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Booking refunded successfully', booking });
  } catch (error) {
    next(error);
  }
};
