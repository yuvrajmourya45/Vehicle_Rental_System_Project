const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const {
  getDashboardStats,
  getAllUsers,
  getAllOwners,
  updateUserStatus,
  updateOwnerStatus,
  verifyVehicle,
  getUserBookings,
  deleteUser,
  updateBookingStatus,
  refundBooking
} = require('../controllers/adminController');

router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/owners', getAllOwners);
router.get('/vehicles', async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate('owner', 'name email');
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('vehicle', 'name')
      .populate('user', 'name')
      .populate('owner', 'name');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/drivers', async (req, res) => {
  try {
    const Driver = require('../models/Driver');
    const drivers = await Driver.find().populate('owner', 'name email');
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put('/users/:id/status', updateUserStatus);
router.get('/users/:id/bookings', getUserBookings);
router.delete('/users/:id', deleteUser);
router.put('/bookings/:id/status', updateBookingStatus);
router.post('/bookings/:id/refund', refundBooking);
router.put('/owners/:id/status', updateOwnerStatus);
router.put('/vehicles/:id/status', verifyVehicle);

module.exports = router;
