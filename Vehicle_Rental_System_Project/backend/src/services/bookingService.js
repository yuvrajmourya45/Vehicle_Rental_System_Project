// ============ Booking Service ============
// Business logic for booking operations

const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const { BOOKING_STATUS, VEHICLE_AVAILABILITY } = require('../constants/statuses');

// Calculate days between dates
const calculateDays = (date1, date2) => {
  return Math.ceil((new Date(date2) - new Date(date1)) / (1000 * 60 * 60 * 24));
};

// Create new booking
const createBooking = async (bookingData, userId) => {
  const { vehicleId, startDate, endDate, location, needDriver, driverCharges, totalAmount } = bookingData;
  
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle || vehicle.status !== 'verified') {
    throw new Error('Vehicle not available');
  }

  const conflictingBooking = await Booking.findOne({
    vehicle: vehicleId,
    status: { $in: [BOOKING_STATUS.PENDING, BOOKING_STATUS.APPROVED] },
    $or: [{ startDate: { $lte: endDate }, endDate: { $gte: startDate } }]
  });

  if (conflictingBooking) {
    throw new Error('Vehicle already booked for these dates');
  }

  return await Booking.create({
    vehicle: vehicleId,
    user: userId,
    owner: vehicle.owner,
    startDate,
    endDate,
    location,
    totalAmount,
    needDriver: needDriver || false,
    driverCharges: driverCharges || 0
  });
};

// Get bookings by role (user or owner)
const getBookingsByRole = async (userId, role) => {
  const query = role === 'user' ? { user: userId } : { owner: userId };
  return await Booking.find(query)
    .populate('vehicle', 'name price category images')
    .populate(role === 'user' ? 'owner' : 'user', 'name email phone')
    .sort({ createdAt: -1 });
};

const getUserBookings = (userId) => getBookingsByRole(userId, 'user');
const getOwnerBookings = (userId) => getBookingsByRole(userId, 'owner');

// Get all bookings (Admin)
const getAllBookings = async () => {
  return await Booking.find()
    .populate('vehicle', 'name price category')
    .populate('user owner', 'name email')
    .sort({ createdAt: -1 });
};

// Update booking status with calculations
const updateBookingStatus = async (bookingId, updateData, userRole, userId) => {
  const { status, paymentStatus, actualReturnDate, extendEndDate } = updateData;
  
  const booking = await Booking.findById(bookingId).populate('vehicle');
  if (!booking) throw new Error('Booking not found');

  if (userRole === 'owner' && booking.owner.toString() !== userId.toString()) {
    throw new Error('Not authorized');
  }

  if (status) booking.status = status;
  if (paymentStatus) booking.paymentStatus = paymentStatus;

  // Calculate late penalty
  if (actualReturnDate) {
    booking.actualReturnDate = actualReturnDate;
    const lateDays = calculateDays(booking.endDate, actualReturnDate);
    
    if (lateDays > 0) {
      booking.latePenalty = lateDays * booking.vehicle.price * 1.5;
      booking.totalAmount += booking.latePenalty;
    }
  }

  // Calculate extension charges
  if (extendEndDate) {
    const extraDays = calculateDays(booking.endDate, extendEndDate);
    
    if (extraDays > 0) {
      booking.endDate = extendEndDate;
      booking.totalAmount += extraDays * booking.vehicle.price;
    }
  }

  await booking.save();

  // Update vehicle availability
  if (status === BOOKING_STATUS.APPROVED) {
    await Vehicle.findByIdAndUpdate(booking.vehicle, { 
      availability: VEHICLE_AVAILABILITY.RENTED, 
      $inc: { bookingCount: 1 } 
    });
  } else if (status === BOOKING_STATUS.COMPLETED) {
    await Vehicle.findByIdAndUpdate(booking.vehicle, { 
      availability: VEHICLE_AVAILABILITY.AVAILABLE 
    });
  }

  return booking;
};

module.exports = {
  createBooking,
  getUserBookings,
  getOwnerBookings,
  getAllBookings,
  updateBookingStatus
};
