const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getMyVehicles
} = require('../controllers/vehicleController');

// Test route
router.post('/test', (req, res) => {
  res.json({ message: 'Vehicle routes working', body: req.body });
});

router.get('/', getVehicles);
router.get('/my-vehicles', protect, authorize('owner'), getMyVehicles);
router.post('/upload', protect, authorize('owner'), upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  // For Cloudinary, use the secure_url
  const imageUrl = req.file.path || req.file.secure_url || `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});
router.post('/', protect, authorize('owner'), upload.single('image'), createVehicle);
router.get('/:id', getVehicle);
router.put('/:id', protect, authorize('owner'), updateVehicle);
router.delete('/:id', protect, authorize('owner'), deleteVehicle);

module.exports = router;
