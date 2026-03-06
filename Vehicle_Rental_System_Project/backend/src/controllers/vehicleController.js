const Vehicle = require('../models/Vehicle');

exports.getVehicles = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { status: 'verified' };
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    const vehicles = await Vehicle.find(query).populate('owner', 'name email');
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate('owner', 'name email phone');
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createVehicle = async (req, res) => {
  try {
    const vehicleData = { ...req.body, owner: req.user._id };
    
    // Handle image upload
    if (req.file) {
      vehicleData.images = [req.file.path || req.file.secure_url || `/uploads/${req.file.filename}`];
    }
    
    const vehicle = await Vehicle.create(vehicleData);
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    if (vehicle.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
    const updated = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    if (vehicle.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
    await vehicle.deleteOne();
    res.json({ message: 'Vehicle deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user._id });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
