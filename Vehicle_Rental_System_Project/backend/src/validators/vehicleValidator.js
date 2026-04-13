const validateVehicle = (req, res, next) => {
  const { name, category, price, seats, fuel, transmission, description } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Vehicle name must be at least 2 characters');
  }

  const validCategories = ['Car', 'Bike', 'Bus', 'Truck'];
  if (!category || !validCategories.includes(category)) {
    errors.push('Valid category is required (Car, Bike, Bus, Truck)');
  }

  if (!price || price <= 0) {
    errors.push('Price must be greater than 0');
  }

  if (!seats || seats <= 0) {
    errors.push('Seats must be greater than 0');
  }

  const validFuels = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
  if (!fuel || !validFuels.includes(fuel)) {
    errors.push('Valid fuel type is required');
  }

  const validTransmissions = ['Manual', 'Automatic'];
  if (!transmission || !validTransmissions.includes(transmission)) {
    errors.push('Valid transmission type is required');
  }

  if (!description || description.trim().length < 10) {
    errors.push('Description must be at least 10 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};

module.exports = { validateVehicle };
