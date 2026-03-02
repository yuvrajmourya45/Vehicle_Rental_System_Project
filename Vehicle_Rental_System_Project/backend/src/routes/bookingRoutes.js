const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  updateBookingStatus,
  getAllBookings
} = require('../controllers/bookingController');

router.post('/', protect, authorize('user'), createBooking);
router.get('/my-bookings', protect, authorize('user'), getMyBookings);
router.get('/owner-bookings', protect, authorize('owner'), getOwnerBookings);
router.get('/all', protect, authorize('admin'), getAllBookings);
router.put('/:id/status', protect, updateBookingStatus);
router.put('/:id', protect, authorize('owner', 'user'), async (req, res) => {
  try {
    const Booking = require('../models/Booking');
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/:id', protect, async (req, res) => {
  try {
    const Booking = require('../models/Booking');
    const booking = await Booking.findById(req.params.id)
      .populate('vehicle', 'name price')
      .populate('assignedDriver', 'name phone licenseNumber experience');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
