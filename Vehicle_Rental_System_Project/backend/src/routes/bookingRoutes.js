const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { validateBooking } = require('../validators/bookingValidator');
const {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  updateBookingStatus,
  getAllBookings
} = require('../controllers/bookingController');

router.post('/', protect, authorize('user'), validateBooking, createBooking);
router.get('/my-bookings', protect, authorize('user'), getMyBookings);
router.get('/owner-bookings', protect, authorize('owner'), getOwnerBookings);
router.get('/all', protect, authorize('admin'), getAllBookings);
router.put('/:id/status', protect, updateBookingStatus);
router.put('/:id', protect, authorize('owner', 'user'), async (req, res, next) => {
  try {
    const Booking = require('../models/Booking');
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(booking);
  } catch (err) {
    next(err);
  }
});
router.get('/:id', protect, async (req, res, next) => {
  try {
    const Booking = require('../models/Booking');
    const booking = await Booking.findById(req.params.id)
      .populate('vehicle', 'name price images category')
      .populate('assignedDriver', 'name phone licenseNumber experience');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
