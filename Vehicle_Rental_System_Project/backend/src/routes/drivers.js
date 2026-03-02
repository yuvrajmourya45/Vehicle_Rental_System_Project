const express = require('express');
const Driver = require('../models/Driver');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.get('/', protect, authorize('owner'), async (req, res) => {
  try {
    const drivers = await Driver.find({ owner: req.user._id });
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, authorize('owner'), async (req, res) => {
  try {
    const driver = await Driver.create({ ...req.body, owner: req.user._id });
    res.status(201).json(driver);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', protect, authorize('owner'), async (req, res) => {
  try {
    const driver = await Driver.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true }
    );
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json(driver);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', protect, authorize('owner'), async (req, res) => {
  try {
    const driver = await Driver.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json({ message: 'Driver deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
