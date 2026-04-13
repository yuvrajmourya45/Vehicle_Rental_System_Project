const bookingService = require('../services/bookingService');

exports.createBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.createBooking(req.body, req.user._id);
    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.getUserBookings(req.user._id);
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

exports.getOwnerBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.getOwnerBookings(req.user._id);
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.getAllBookings();
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

exports.updateBookingStatus = async (req, res, next) => {
  try {
    const booking = await bookingService.updateBookingStatus(
      req.params.id,
      req.body,
      req.user.role,
      req.user._id
    );
    res.json(booking);
  } catch (error) {
    next(error);
  }
};
