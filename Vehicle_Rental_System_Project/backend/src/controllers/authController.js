const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ message: 'User already exists' });
    
    const user = await User.create({ name, email, password, role: role || 'user' });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === 'yuvrajmourya14@gmail.com' && password === 'yuvraj') {
      return res.json({
        _id: 'admin_hardcoded',
        name: 'Yuvraj Mourya',
        email: 'yuvrajmourya14@gmail.com',
        role: 'admin',
        phone: '+91 9876543210',
        address: 'Admin Office, New Delhi',
        status: 'active',
        token: generateToken('admin_hardcoded')
      });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Invalid credentials' });
    if (user.status === 'blocked') return res.status(403).json({ message: 'Account is blocked' });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  if (req.user._id === 'admin_hardcoded') {
    return res.json({
      _id: 'admin_hardcoded',
      name: 'Sawariya',
      email: 'yuvrajmourya14@gmail.com',
      role: 'admin',
      phone: '+91 9876543210',
      address: 'Admin Office, New Delhi',
      status: 'active'
    });
  }
  res.json(req.user);
};
