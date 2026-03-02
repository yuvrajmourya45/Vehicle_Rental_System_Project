const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  actualReturnDate: { type: Date },
  location: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  latePenalty: { type: Number, default: 0 },
  needDriver: { type: Boolean, default: false },
  driverCharges: { type: Number, default: 0 },
  assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  paymentMethod: { type: String, enum: ['card', 'cash', 'upi'], default: 'card' },
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'active', 'completed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
