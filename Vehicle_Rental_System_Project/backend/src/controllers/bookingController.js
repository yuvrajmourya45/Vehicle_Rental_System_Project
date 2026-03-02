const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');

exports.createBooking = async (req, res) => {
  try {
    const { vehicleId, startDate, endDate, location, needDriver, driverCharges, totalAmount } = req.body;
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle || vehicle.status !== 'verified') return res.status(400).json({ message: 'Vehicle not available' });

    const conflictingBooking = await Booking.findOne({
      vehicle: vehicleId,
      status: { $in: ['pending', 'approved'] },
      $or: [{ startDate: { $lte: endDate }, endDate: { $gte: startDate } }]
    });
    if (conflictingBooking) return res.status(400).json({ message: 'Vehicle already booked for these dates' });

    const booking = await Booking.create({
      vehicle: vehicleId,
      user: req.user._id,
      owner: vehicle.owner,
      startDate,
      endDate,
      location,
      totalAmount,
      needDriver: needDriver || false,
      driverCharges: driverCharges || 0
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('vehicle', 'name price category')
      .populate('owner', 'name email phone');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOwnerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.user._id })
      .populate('vehicle', 'name price category')
      .populate('user', 'name email phone');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('vehicle', 'name price category')
      .populate('user', 'name email')
      .populate('owner', 'name email');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, paymentStatus, actualReturnDate, extendEndDate } = req.body;
    const booking = await Booking.findById(req.params.id).populate('vehicle');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (req.user.role === 'owner' && booking.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    if (actualReturnDate) {
      booking.actualReturnDate = actualReturnDate;
      const returnDate = new Date(actualReturnDate);
      const expectedDate = new Date(booking.endDate);
      if (returnDate > expectedDate) {
        const lateDays = Math.ceil((returnDate - expectedDate) / (1000 * 60 * 60 * 24));
        booking.latePenalty = lateDays * booking.vehicle.price * 1.5;
        booking.totalAmount += booking.latePenalty;
      }
    }

    if (extendEndDate) {
      const newEndDate = new Date(extendEndDate);
      const oldEndDate = new Date(booking.endDate);
      if (newEndDate > oldEndDate) {
        const extraDays = Math.ceil((newEndDate - oldEndDate) / (1000 * 60 * 60 * 24));
        booking.endDate = extendEndDate;
        booking.totalAmount += extraDays * booking.vehicle.price;
      }
    }

    await booking.save();

    if (status === 'approved') {
      await Vehicle.findByIdAndUpdate(booking.vehicle, { availability: 'rented', $inc: { bookingCount: 1 } });
    }
    if (status === 'completed') {
      await Vehicle.findByIdAndUpdate(booking.vehicle, { availability: 'available' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
