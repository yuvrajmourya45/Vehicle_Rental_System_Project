// ============ Vehicle Service ============
// Business logic for vehicle operations

const Vehicle = require('../models/Vehicle');

// Get all vehicles with filters
const getAllVehicles = async (filters) => {
  const { category, search } = filters;
  const query = { status: 'verified' }; // Only show verified vehicles
  
  if (category) query.category = category;
  if (search) query.name = { $regex: search, $options: 'i' };
  
  return await Vehicle.find(query).populate('owner', 'name email');
};

// Get vehicle by ID
const getVehicleById = async (vehicleId) => {
  const vehicle = await Vehicle.findById(vehicleId).populate('owner', 'name email phone');
  if (!vehicle) throw new Error('Vehicle not found');
  return vehicle;
};

// Create new vehicle
const createVehicle = async (vehicleData, ownerId, file) => {
  const data = { ...vehicleData, owner: ownerId };
  
  if (file) {
    // Cloudinary returns file.path as full URL, local storage returns filename
    const imagePath = file.secure_url || file.path;
    const isFullUrl = imagePath && imagePath.startsWith('http');
    data.images = [isFullUrl ? imagePath : `uploads/${file.filename}`];
  }
  
  return await Vehicle.create(data);
};

// Update vehicle
const updateVehicle = async (vehicleId, ownerId, updateData) => {
  const vehicle = await Vehicle.findById(vehicleId);
  
  if (!vehicle) throw new Error('Vehicle not found');
  if (vehicle.owner.toString() !== ownerId.toString()) {
    throw new Error('Not authorized to update this vehicle');
  }
  
  return await Vehicle.findByIdAndUpdate(vehicleId, updateData, { 
    new: true, 
    runValidators: true 
  });
};

// Delete vehicle
const deleteVehicle = async (vehicleId, ownerId) => {
  const vehicle = await Vehicle.findById(vehicleId);
  
  if (!vehicle) throw new Error('Vehicle not found');
  if (vehicle.owner.toString() !== ownerId.toString()) {
    throw new Error('Not authorized to delete this vehicle');
  }
  
  await vehicle.deleteOne();
  return { message: 'Vehicle deleted successfully' };
};

// Get owner's vehicles
const getOwnerVehicles = async (ownerId) => {
  return await Vehicle.find({ owner: ownerId });
};

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getOwnerVehicles
};
