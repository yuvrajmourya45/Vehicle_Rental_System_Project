const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../validators/authValidator');
const { authLimiter } = require('../middleware/security');

router.post('/register', authLimiter, validateRegister, register);
router.post('/login', authLimiter, validateLogin, login);
router.get('/me', protect, getMe);

module.exports = router;
