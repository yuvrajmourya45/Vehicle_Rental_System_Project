const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/400x300?text=No+Image';
  
  // If it's already a full URL (http/https), return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If it starts with uploads/, add the base URL
  if (imagePath.startsWith('uploads/')) {
    return `${API_BASE_URL}/${imagePath}`;
  }
  
  // If it doesn't start with uploads/, add uploads/ prefix
  return `${API_BASE_URL}/uploads/${imagePath}`;
};