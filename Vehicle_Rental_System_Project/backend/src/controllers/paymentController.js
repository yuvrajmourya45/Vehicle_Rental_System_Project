const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

exports.createPayment = async (req, res) => {
  try {
    const { bookingId, method } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });

    const payment = await Payment.create({
      booking: bookingId,
      user: req.user._id,
      amount: booking.totalAmount,
      method,
      status: method === 'cash' ? 'pending' : 'completed',
      transactionId: 'TXN' + Date.now()
    });

    if (payment.status === 'completed') {
      booking.paymentStatus = 'paid';
      await booking.save();
    }
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate({
        path: 'booking',
        populate: { path: 'vehicle', select: 'name price' }
      });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (status === 'completed') {
      await Booking.findByIdAndUpdate(payment.booking, { paymentStatus: 'paid' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
