import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { CreditCard, Wallet, Smartphone, Loader2, Lock, CheckCircle, Car } from "lucide-react";
import API from "../../services/api";
import { getImageUrl } from "../../utils/imageUtils";

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [cardData, setCardData] = useState({ cardNumber: "", cardName: "", expiryDate: "", cvv: "" });
  const [upiId, setUpiId] = useState("");
  const [showCvv, setShowCvv] = useState(false);

  useEffect(() => { fetchBooking(); }, [id]);

  const fetchBooking = async () => {
    try {
      const { data } = await API.get(`/bookings/${id}`);
      setBooking(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  const getCardType = () => {
    const num = cardData.cardNumber.replace(/\s/g, '');
    if (num.startsWith('4')) return 'VISA';
    if (num.startsWith('5')) return 'MASTERCARD';
    if (num.startsWith('3')) return 'AMEX';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      await API.put(`/bookings/${id}`, {
        paymentMethod,
        paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid'
      });
      navigate(`/confirmation/${id}`);
    } catch (err) {
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 size={48} className="animate-spin text-blue-600" />
    </div>
  );

  const methods = [
    { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, color: 'text-blue-600' },
    { id: 'upi', label: 'UPI', icon: Smartphone, color: 'text-purple-600' },
    { id: 'cash', label: 'Cash on Pickup', icon: Wallet, color: 'text-green-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50">
      <Navbar />

      <div className="px-4 py-10 max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Complete Payment</h2>
          <p className="text-gray-500 mt-1">Secure & encrypted payment processing</p>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          {/* Left: Payment Form */}
          <div className="md:col-span-3">
            {/* Method Selector */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
              <p className="text-sm font-semibold text-gray-600 mb-3">Select Payment Method</p>
              <div className="grid grid-cols-3 gap-3">
                {methods.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      paymentMethod === m.id
                        ? 'border-blue-600 bg-blue-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <m.icon size={22} className={paymentMethod === m.id ? m.color : 'text-gray-400'} />
                    <span className={`text-xs font-semibold ${paymentMethod === m.id ? 'text-blue-700' : 'text-gray-500'}`}>
                      {m.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Card Payment */}
            {paymentMethod === 'card' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                {/* Visual Card */}
                <div className="relative w-full h-44 rounded-2xl mb-6 overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%)' }}>
                  <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                  <div className="absolute top-5 left-6 right-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="w-10 h-7 rounded bg-yellow-400 opacity-90 mb-1"
                          style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }} />
                      </div>
                      <span className="text-white font-bold text-lg tracking-wider opacity-90">
                        {getCardType() || 'CARD'}
                      </span>
                    </div>
                  </div>
                  <div className="absolute bottom-10 left-6 right-6">
                    <p className="text-white text-xl font-mono tracking-widest">
                      {cardData.cardNumber || '•••• •••• •••• ••••'}
                    </p>
                  </div>
                  <div className="absolute bottom-4 left-6 right-6 flex justify-between">
                    <div>
                      <p className="text-blue-200 text-xs uppercase">Card Holder</p>
                      <p className="text-white text-sm font-semibold uppercase tracking-wide">
                        {cardData.cardName || 'YOUR NAME'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-200 text-xs uppercase">Expires</p>
                      <p className="text-white text-sm font-semibold">{cardData.expiryDate || 'MM/YY'}</p>
                    </div>
                  </div>
                </div>

                {/* Card Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-mono tracking-wider"
                        placeholder="1234 5678 9012 3456"
                        value={cardData.cardNumber}
                        onChange={(e) => setCardData({ ...cardData, cardNumber: formatCardNumber(e.target.value) })}
                        required
                      />
                      <CreditCard size={18} className="absolute right-3 top-3.5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Cardholder Name</label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 uppercase"
                      placeholder="JOHN DOE"
                      value={cardData.cardName}
                      onChange={(e) => setCardData({ ...cardData, cardName: e.target.value.toUpperCase() })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Expiry Date</label>
                      <input
                        type="text"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-mono"
                        placeholder="MM/YY"
                        value={cardData.expiryDate}
                        onChange={(e) => setCardData({ ...cardData, expiryDate: formatExpiry(e.target.value) })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">CVV</label>
                      <div className="relative">
                        <input
                          type={showCvv ? 'text' : 'password'}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-mono"
                          placeholder="•••"
                          maxLength={4}
                          value={cardData.cvv}
                          onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '') })}
                          required
                        />
                        <button type="button" onClick={() => setShowCvv(!showCvv)}
                          className="absolute right-3 top-3.5 text-gray-400 text-xs">
                          {showCvv ? '🙈' : '👁'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {processing ? <Loader2 size={18} className="animate-spin" /> : <Lock size={16} />}
                    {processing ? 'Processing...' : `Pay ₹${booking?.totalAmount?.toFixed(2)}`}
                  </button>
                </form>
              </div>
            )}

            {/* Cash Payment */}
            {paymentMethod === 'cash' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wallet size={40} className="text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">Pay with Cash</h3>
                  <p className="text-gray-500 text-sm">Pay at the time of vehicle pickup</p>
                </div>

                <div className="space-y-3 mb-6">
                  {[
                    { icon: '📍', title: 'Visit pickup location', desc: 'Go to your selected pickup address' },
                    { icon: '💵', title: 'Bring exact amount', desc: `Keep ₹${booking?.totalAmount?.toFixed(2)} ready in cash` },
                    { icon: '🧾', title: 'Get receipt', desc: 'Collect your booking receipt on payment' },
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
                      <span className="text-2xl">{step.icon}</span>
                      <div>
                        <p className="font-semibold text-sm text-gray-800">{step.title}</p>
                        <p className="text-xs text-gray-500">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-yellow-600">⚠️</span>
                    <p className="text-sm font-semibold text-yellow-800">Important Note</p>
                  </div>
                  <p className="text-xs text-yellow-700">
                    Your booking will be marked as <strong>Payment Pending</strong> until cash is received. 
                    The vehicle will be held for you.
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-3.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {processing ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                    {processing ? 'Confirming...' : 'Confirm Cash Booking'}
                  </button>
                </form>
              </div>
            )}

            {/* UPI Payment */}
            {paymentMethod === 'upi' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="text-center mb-5">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Smartphone size={40} className="text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">Pay with UPI</h3>
                  <p className="text-gray-500 text-sm">Scan QR or enter UPI ID</p>
                </div>

                {/* QR Code Placeholder */}
                <div className="flex justify-center mb-5">
                  <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 w-44 h-44 flex flex-col items-center justify-center">
                    <div className="grid grid-cols-5 gap-0.5 mb-2">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div key={i} className={`w-3 h-3 rounded-sm ${Math.random() > 0.5 ? 'bg-gray-800' : 'bg-white'}`} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Scan to Pay</p>
                  </div>
                </div>

                <div className="text-center text-xs text-gray-400 mb-4">— OR enter UPI ID —</div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                    placeholder="yourname@upi / yourname@okaxis"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-3.5 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {processing ? <Loader2 size={18} className="animate-spin" /> : <Lock size={16} />}
                    {processing ? 'Processing...' : `Pay ₹${booking?.totalAmount?.toFixed(2)}`}
                  </button>
                </form>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
              <Lock size={12} />
              <span>256-bit SSL encrypted · Your data is safe</span>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-6">
              <h3 className="font-bold text-gray-800 mb-4">Order Summary</h3>

              {/* Vehicle Image */}
              <div className="rounded-xl overflow-hidden mb-4 h-36">
                <img
                  src={getImageUrl(booking?.vehicle?.images?.[0])}
                  alt={booking?.vehicle?.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/300x150?text=Vehicle'; }}
                />
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Car size={16} className="text-blue-600" />
                <p className="font-semibold text-gray-800">{booking?.vehicle?.name}</p>
              </div>

              <div className="space-y-2 text-sm border-t pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Vehicle charges</span>
                  <span className="font-medium">₹{(booking?.totalAmount - (booking?.driverCharges || 0) - (booking?.latePenalty || 0)).toFixed(2)}</span>
                </div>
                {booking?.driverCharges > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Driver charges</span>
                    <span className="font-medium">₹{booking.driverCharges}</span>
                  </div>
                )}
                {booking?.latePenalty > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Late penalty</span>
                    <span className="font-medium">₹{booking.latePenalty}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-gray-800 border-t pt-2 mt-2 text-base">
                  <span>Total</span>
                  <span className="text-blue-600">₹{booking?.totalAmount?.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4 bg-blue-50 rounded-xl p-3">
                <p className="text-xs text-blue-700 font-medium">
                  {paymentMethod === 'cash'
                    ? '💵 Pay cash at pickup. Booking confirmed instantly.'
                    : paymentMethod === 'upi'
                    ? '📱 UPI payment is instant & secure.'
                    : '💳 Card payment is processed securely.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
