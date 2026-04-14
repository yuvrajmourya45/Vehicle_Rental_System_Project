// ============ Auth Service ============
// Business logic for authentication

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const ROLES = require('../constants/roles');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
};

// Register new user
const registerUser = async (userData) => {
  const { name, email, password, role } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const err = new Error('User already exists with this email');
    err.statusCode = 400;
    throw err;
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || ROLES.USER
  });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id)
  };
};

// Login user
const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  
  if (!user || !(await user.comparePassword(password))) {
    throw new Error('Invalid credentials');
  }

  if (user.status === 'blocked') {
    throw new Error('Account is blocked');
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    address: user.address,
    status: user.status,
    token: generateToken(user._id)
  };
};

// Get user by ID
const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) throw new Error('User not found');
  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  generateToken
};
