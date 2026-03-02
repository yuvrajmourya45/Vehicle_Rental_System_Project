const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, enum: ['Car', 'Bike', 'Bus', 'Truck'] },
  price: { type: Number, required: true },
  seats: { type: Number, required: true },
  fuel: { type: String, required: true, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'] },
  transmission: { type: String, required: true, enum: ['Manual', 'Automatic'] },
  description: { type: String, required: true },
  images: [{ type: String }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  availability: { type: String, enum: ['available', 'rented'], default: 'available' },
  bookingCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
