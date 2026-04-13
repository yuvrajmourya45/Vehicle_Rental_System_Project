// ============ Upload Middleware ============
// Handles image uploads (Cloudinary or Local)

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const path = require('path');
const fs = require('fs');

// Check if Cloudinary is configured
const useCloudinary = process.env.CLOUDINARY_CLOUD_NAME && 
                      process.env.CLOUDINARY_API_KEY && 
                      process.env.CLOUDINARY_API_SECRET;

let storage;

if (useCloudinary) {
  // Cloudinary storage (Production)
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'vehicle-rentals',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'],
      transformation: [{ width: 1200, height: 800, crop: 'limit' }]
    }
  });
} else {
  // Local storage (Development)
  const uploadsDir = path.join(__dirname, '../../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
  });
}

// Configure multer with storage and validation
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (!file) return cb(null, true);
    
    const allowedTypes = /jpeg|jpg|png|gif|webp|avif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    
    cb(new Error(`Invalid file type. Only JPEG, PNG, GIF, WEBP, AVIF allowed. Got: ${file.mimetype}`));
  }
});

module.exports = upload;
