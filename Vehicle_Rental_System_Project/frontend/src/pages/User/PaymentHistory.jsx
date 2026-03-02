import React, { useState, useEffect } from "react";
import UserSidebar from "../../components/UserSidebar";
import { CreditCard, Calendar, Loader2 } from "lucide-react";
import API from "../../services/api";

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data } = await API.get('/bookings/my-bookings');
      setPayments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (loading) return (
    <div className="flex"><UserSidebar /><div className="md:ml-56 flex-1 flex items-center justify-center h-screen"><Loader2 size={48} className="animate-spin text-blue-600" /></div></div>
  );

  return (
    <div className="flex">
      <UserSidebar />
      
      <div className="md:ml-56 flex-1 bg-gray-100 min-h-screen p-4 md:p-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 mb-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Payment History</h1>
          <p className="text-blue-100">Track all your payment transactions</p>
        </div>
        
        {payments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <CreditCard size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No payment history</h3>
            <p className="text-gray-500">Your payment transactions will appear here</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {payments.map((payment) => (
              <div key={payment._id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{payment.vehicle?.name}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                        <Calendar size={18} className="text-blue-600" />
                        <span className="font-medium">{formatDate(payment.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                        <CreditCard size={18} className="text-purple-600" />
                        <span className="font-medium uppercase">{payment.paymentMethod || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-3xl font-bold mb-2 ${
                      payment.status === 'rejected' ? 'text-red-600 line-through' : 'text-green-600'
                    }`}>${payment.totalAmount}</p>
                    <span className={`px-4 py-2 rounded-xl text-sm font-bold border-2 ${
                      payment.paymentStatus === "paid" && payment.status !== 'rejected'
                        ? "bg-green-50 text-green-700 border-green-200" 
                        : payment.status === 'rejected'
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-yellow-50 text-yellow-700 border-yellow-200"
                    }`}>
                      {payment.status === 'rejected' ? 'REJECTED - REFUNDED' : payment.paymentStatus === 'paid' ? 'PAID' : 'PENDING'}
                    </span>
                  </div>
                </div>
                {payment.status === 'rejected' && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3">
                    <p className="text-sm text-red-700">⚠️ This booking was rejected by the owner. Amount will be refunded within 5-7 business days.</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
