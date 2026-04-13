const authService = require('../services/authService');

exports.register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.loginUser(email, password);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (error) {
    next(error);
  }
};
