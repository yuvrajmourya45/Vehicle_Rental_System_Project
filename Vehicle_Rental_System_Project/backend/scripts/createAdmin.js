const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../src/models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vehicle_rental');
    console.log('MongoDB Connected');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'yuvrajmourya185@gmail.com' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: 'Yuvraj Mourya',
      email: 'yuvrajmourya185@gmail.com',
      password: 'yuvraj', 
      role: 'admin',
      phone: '+91 9876543210',
      address: 'Admin Office',
      status: 'active',
      kycStatus: 'verified'
    });

    console.log('Admin user created successfully!');
    console.log('Email: yuvrajmourya185@gmail.com');
    console.log('Password: yuvraj');
    console.log('⚠️  IMPORTANT: Change this password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();
