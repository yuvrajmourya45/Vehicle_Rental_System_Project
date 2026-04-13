const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Remove /api from end to get base server URL for static files
const BASE_URL = API_URL.replace(/\/api$/, '');

export const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/400x300?text=No+Image';

  // Already a full URL (Cloudinary etc.)
  if (imagePath.startsWith('http')) return imagePath;

  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;

  return `${BASE_URL}/${cleanPath}`;
};
