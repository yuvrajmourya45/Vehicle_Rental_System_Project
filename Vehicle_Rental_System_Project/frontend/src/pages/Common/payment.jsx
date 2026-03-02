import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { CreditCard, Wallet, Smartphone, Loader2 } from "lucide-react";
import API from "../../services/api";

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: ""
  });

  useEffect(() => {
    fetchBooking();
  }, [id]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/bookings/${id}`, { 
        paymentMethod,
        paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid'
      });
      navigate(`/confirmation/${id}`);
    } catch (err) {
      alert('Payment failed');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"><Loader2 size={48} className="animate-spin text-blue-600" /></div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="px-4 py-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-4 text-center">Payment</h2>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div 
            onClick={() => setPaymentMethod("card")}
            className={`bg-white rounded-lg p-3 cursor-pointer border-2 transition ${
              paymentMethod === "card" ? "border-blue-600" : "border-gray-200"
            }`}
          >
            <CreditCard className={`mx-auto mb-1 ${paymentMethod === "card" ? "text-blue-600" : "text-gray-400"}`} size={24} />
            <p className="text-center font-semibold text-xs">Card</p>
          </div>

          <div 
            onClick={() => setPaymentMethod("cash")}
            className={`bg-white rounded-lg p-3 cursor-pointer border-2 transition ${
              paymentMethod === "cash" ? "border-blue-600" : "border-gray-200"
            }`}
          >
            <Wallet className={`mx-auto mb-1 ${paymentMethod === "cash" ? "text-blue-600" : "text-gray-400"}`} size={24} />
            <p className="text-center font-semibold text-xs">Cash</p>
          </div>

          <div 
            onClick={() => setPaymentMethod("upi")}
            className={`bg-white rounded-lg p-3 cursor-pointer border-2 transition ${
              paymentMethod === "upi" ? "border-blue-600" : "border-gray-200"
            }`}
          >
            <Smartphone className={`mx-auto mb-1 ${paymentMethod === "upi" ? "text-blue-600" : "text-gray-400"}`} size={24} />
            <p className="text-center font-semibold text-xs">UPI</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="bg-blue-50 p-3 rounded-lg mb-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-semibold text-sm">Total Amount</span>
              <span className="text-xl font-bold text-blue-600">${booking?.totalAmount || 0}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {paymentMethod === "card" && (
              <>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Card Number</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-blue-600" 
                    placeholder="1234 5678 9012 3456"
                    value={cardData.cardNumber}
                    onChange={(e) => setCardData({...cardData, cardNumber: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Cardholder Name</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-blue-600" 
                    placeholder="John Doe"
                    value={cardData.cardName}
                    onChange={(e) => setCardData({...cardData, cardName: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Expiry Date</label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-blue-600" 
                      placeholder="MM/YY"
                      value={cardData.expiryDate}
                      onChange={(e) => setCardData({...cardData, expiryDate: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">CVV</label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-blue-600" 
                      placeholder="123"
                      value={cardData.cvv}
                      onChange={(e) => setCardData({...cardData, cvv: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {paymentMethod === "cash" && (
              <div className="text-center py-6">
                <Wallet size={48} className="mx-auto mb-3 text-blue-600" />
                <h3 className="text-lg font-semibold mb-2">Pay with Cash</h3>
                <p className="text-gray-600 text-sm mb-3">Pay in cash when you pick up the vehicle</p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-800">Bring exact amount: <span className="font-bold">${booking?.totalAmount || 0}</span></p>
                </div>
              </div>
            )}

            {paymentMethod === "upi" && (
              <div className="text-center py-6">
                <Smartphone size={48} className="mx-auto mb-3 text-blue-600" />
                <h3 className="text-lg font-semibold mb-2">Pay with UPI</h3>
                <div className="bg-gray-100 p-4 rounded-lg mb-3">
                  <p className="text-xs text-gray-600 mb-2">Scan QR Code or Enter UPI ID</p>
                  <div className="bg-white w-32 h-32 mx-auto rounded-lg flex items-center justify-center mb-3">
                    <p className="text-gray-400 text-xs">QR Code</p>
                  </div>
                  <input 
                    type="text" 
                    className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-blue-600" 
                    placeholder="Enter UPI ID (e.g., name@upi)"
                  />
                </div>
              </div>
            )}

            <button type="submit" className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 text-sm">
              {paymentMethod === "cash" ? "Confirm Booking" : "Complete Payment"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
