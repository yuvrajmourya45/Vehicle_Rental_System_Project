const vehicleService = require('../services/vehicleService');

exports.getVehicles = async (req, res, next) => {
  try {
    const vehicles = await vehicleService.getAllVehicles(req.query);
    res.json(vehicles);
  } catch (error) {
    next(error);
  }
};

exports.getVehicle = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.getVehicleById(req.params.id);
    res.json(vehicle);
  } catch (error) {
    next(error);
  }
};

exports.createVehicle = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.createVehicle(req.body, req.user._id, req.file);
    res.status(201).json(vehicle);
  } catch (error) {
    next(error);
  }
};

exports.updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.updateVehicle(req.params.id, req.user._id, req.body);
    res.json(vehicle);
  } catch (error) {
    next(error);
  }
};

exports.deleteVehicle = async (req, res, next) => {
  try {
    const result = await vehicleService.deleteVehicle(req.params.id, req.user._id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.getMyVehicles = async (req, res, next) => {
  try {
    const vehicles = await vehicleService.getOwnerVehicles(req.user._id);
    res.json(vehicles);
  } catch (error) {
    next(error);
  }
};
