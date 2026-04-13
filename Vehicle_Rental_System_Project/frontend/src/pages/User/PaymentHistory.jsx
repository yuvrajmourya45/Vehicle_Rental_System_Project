import React, { useState, useEffect } from "react";
import UserSidebar from "../../components/UserSidebar";
import { CreditCard, Calendar, Loader2, Wallet, Smartphone, TrendingUp, CheckCircle, Clock, XCircle } from "lucide-react";
import API from "../../services/api";
import { getImageUrl } from "../../utils/imageUtils";

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => { fetchPayments(); }, []);

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

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const getMethodConfig = (method) => {
    if (method === 'card') return { icon: CreditCard, label: 'Credit / Debit Card', bg: 'bg-blue-50', text: 'text-blue-600', iconColor: 'text-blue-600' };
    if (method === 'upi') return { icon: Smartphone, label: 'UPI', bg: 'bg-purple-50', text: 'text-purple-600', iconColor: 'text-purple-600' };
    return { icon: Wallet, label: 'Cash on Pickup', bg: 'bg-green-50', text: 'text-green-600', iconColor: 'text-green-600' };
  };

  const getPaymentBadge = (payment) => {
    if (payment.status === 'rejected') return { label: 'Refunded', bg: 'bg-red-100', text: 'text-red-700', icon: XCircle };
    if (payment.paymentStatus === 'paid') return { label: 'Paid', bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle };
    return { label: 'Pending', bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock };
  };

  const totalPaid = payments
    .filter(p => p.paymentStatus === 'paid' && p.status !== 'rejected')
    .reduce((sum, p) => sum + (p.totalAmount || 0), 0);

  const filtered = filter === 'all' ? payments
    : filter === 'paid' ? payments.filter(p => p.paymentStatus === 'paid' && p.status !== 'rejected')
    : filter === 'pending' ? payments.filter(p => p.paymentStatus !== 'paid' && p.status !== 'rejected')
    : payments.filter(p => p.status === 'rejected');

  if (loading) return (
    <div className="flex">
      <UserSidebar />
      <div className="md:ml-56 flex-1 flex items-center justify-center h-screen">
        <Loader2 size={48} className="animate-spin text-blue-600" />
      </div>
    </div>
  );

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <UserSidebar />

      <div className="md:ml-56 flex-1 p-4 md:p-8">
        <div className="mb-6 mt-16 md:mt-0">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Payment History</h1>
          <p className="text-gray-500">Track all your payment transactions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp size={16} className="text-blue-600" />
              </div>
              <span className="text-xs text-gray-500 font-medium">Total Spent</span>
            </div>
            <p className="text-xl font-bold text-gray-800">₹{totalPaid.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle size={16} className="text-green-600" />
              </div>
              <span className="text-xs text-gray-500 font-medium">Paid</span>
            </div>
            <p className="text-xl font-bold text-gray-800">
              {payments.filter(p => p.paymentStatus === 'paid' && p.status !== 'rejected').length}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock size={16} className="text-yellow-600" />
              </div>
              <span className="text-xs text-gray-500 font-medium">Pending</span>
            </div>
            <p className="text-xl font-bold text-gray-800">
              {payments.filter(p => p.paymentStatus !== 'paid' && p.status !== 'rejected').length}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle size={16} className="text-red-600" />
              </div>
              <span className="text-xs text-gray-500 font-medium">Refunded</span>
            </div>
            <p className="text-xl font-bold text-gray-800">
              {payments.filter(p => p.status === 'rejected').length}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {['all', 'paid', 'pending', 'refunded'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition capitalize ${
                filter === f
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-blue-300'
              }`}
            >
              {f === 'all' ? `All (${payments.length})` : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard size={40} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-1">No transactions found</h3>
            <p className="text-gray-400 text-sm">No payment records match this filter</p>
          </div>
        )}

        {/* Payment Cards */}
        <div className="grid gap-4">
          {filtered.map((payment) => {
            const method = getMethodConfig(payment.paymentMethod);
            const badge = getPaymentBadge(payment);
            const MethodIcon = method.icon;
            const BadgeIcon = badge.icon;

            return (
              <div key={payment._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                <div className="flex flex-col md:flex-row">
                  {/* Vehicle Image */}
                  <div className="md:w-40 h-36 md:h-auto flex-shrink-0">
                    <img
                      src={getImageUrl(payment.vehicle?.images?.[0])}
                      alt={payment.vehicle?.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/160x120?text=Vehicle'; }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-3">
                          {payment.vehicle?.name || 'Vehicle'}
                        </h3>

                        {/* Payment Method Card */}
                        <div className={`inline-flex items-center gap-2.5 ${method.bg} rounded-xl px-4 py-2.5 mb-3`}>
                          <MethodIcon size={18} className={method.iconColor} />
                          <div>
                            <p className={`text-xs font-bold ${method.text}`}>{method.label}</p>
                            <p className="text-xs text-gray-400">
                              {payment.paymentMethod === 'card' && '•••• •••• •••• ****'}
                              {payment.paymentMethod === 'upi' && 'UPI Transfer'}
                              {payment.paymentMethod === 'cash' && 'Pay at pickup'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar size={13} className="text-gray-400" />
                          <span>{formatDate(payment.startDate)} → {formatDate(payment.endDate)}</span>
                        </div>
                      </div>

                      {/* Amount & Badge */}
                      <div className="flex md:flex-col items-center md:items-end gap-3">
                        <p className={`text-2xl font-bold ${payment.status === 'rejected' ? 'text-red-400 line-through' : 'text-gray-800'}`}>
                          ₹{payment.totalAmount?.toFixed(2)}
                        </p>
                        <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
                          <BadgeIcon size={12} />
                          {badge.label}
                        </span>
                      </div>
                    </div>

                    {/* Refund Notice */}
                    {payment.status === 'rejected' && (
                      <div className="mt-3 bg-red-50 border border-red-100 rounded-xl p-3 flex items-start gap-2">
                        <XCircle size={15} className="text-red-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-red-700">
                          Booking was rejected. Refund of <strong>₹{payment.totalAmount?.toFixed(2)}</strong> will be processed within 5–7 business days.
                        </p>
                      </div>
                    )}

                    {/* Cash Pending Notice */}
                    {payment.paymentMethod === 'cash' && payment.paymentStatus !== 'paid' && payment.status !== 'rejected' && (
                      <div className="mt-3 bg-yellow-50 border border-yellow-100 rounded-xl p-3 flex items-start gap-2">
                        <Clock size={15} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-yellow-700">
                          Cash payment of <strong>₹{payment.totalAmount?.toFixed(2)}</strong> is due at vehicle pickup.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
