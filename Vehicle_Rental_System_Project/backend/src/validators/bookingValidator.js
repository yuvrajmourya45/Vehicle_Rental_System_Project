const validateBooking = (req, res, next) => {
  const { vehicleId, startDate, endDate, location, totalAmount } = req.body;
  const errors = [];

  if (!vehicleId) {
    errors.push('Vehicle ID is required');
  }

  if (!startDate) {
    errors.push('Start date is required');
  }

  if (!endDate) {
    errors.push('End date is required');
  }

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (start < now) {
      errors.push('Start date cannot be in the past');
    }

    if (end <= start) {
      errors.push('End date must be after start date');
    }
  }

  if (!location || location.trim().length < 3) {
    errors.push('Location must be at least 3 characters');
  }

  if (!totalAmount || totalAmount <= 0) {
    errors.push('Total amount must be greater than 0');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};

module.exports = { validateBooking };
