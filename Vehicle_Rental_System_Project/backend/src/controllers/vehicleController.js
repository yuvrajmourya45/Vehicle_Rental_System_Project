const Vehicle = require('../models/Vehicle');

exports.getVehicles = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {}; // Remove status filter to show all vehicles
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    const vehicles = await Vehicle.find(query).populate('owner', 'name email');
    console.log(`Found ${vehicles.length} vehicles`);
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
    console.log('Creating vehicle with data:', req.body);
    console.log('File received:', req.file);
    
    const vehicleData = { ...req.body, owner: req.user._id };
    
    // Handle image upload
    if (req.file) {
      const imagePath = req.file.path || req.file.secure_url || `uploads/${req.file.filename}`;
      vehicleData.images = [imagePath.replace(/\\/g, '/')];
      console.log('Image path set to:', vehicleData.images[0]);
    } else {
      console.log('No file uploaded');
    }
    
    const vehicle = await Vehicle.create(vehicleData);
    console.log('Vehicle created successfully:', vehicle._id);
    res.status(201).json(vehicle);
  } catch (error) {
    console.error('Error creating vehicle:', error);
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
    console.log(`Found ${vehicles.length} vehicles for owner ${req.user._id}`);
    vehicles.forEach(v => {
      console.log(`Vehicle: ${v.name}, Images: ${JSON.stringify(v.images)}`);
    });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
