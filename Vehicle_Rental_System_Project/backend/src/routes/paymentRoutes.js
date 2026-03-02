const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createPayment,
  getMyPayments,
  updatePaymentStatus
} = require('../controllers/paymentController');

router.post('/', protect, createPayment);
router.get('/my-payments', protect, getMyPayments);
router.put('/:id/status', protect, updatePaymentStatus);

module.exports = router;
