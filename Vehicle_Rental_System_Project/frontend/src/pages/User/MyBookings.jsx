import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserSidebar from "../../components/UserSidebar";
import { Calendar, MapPin, Loader2, Car, CreditCard, Wallet, Smartphone, ChevronDown, ChevronUp } from "lucide-react";
import API from "../../services/api";
import { getImageUrl } from "../../utils/imageUtils";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/bookings/my-bookings');
      console.log('RAW bookings:', JSON.stringify(data.map(b => ({ name: b.vehicle?.name, images: b.vehicle?.images }))));
      setBookings(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const getStatusConfig = (status) => {
    const map = {
      approved: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500', label: 'Approved' },
      completed: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500', label: 'Completed' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500', label: 'Pending' },
      active: { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500', label: 'Active' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', label: 'Cancelled' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', label: 'Rejected' },
    };
    return map[status] || map.pending;
  };

  const getPaymentIcon = (method) => {
    if (method === 'card') return <CreditCard size={14} className="text-blue-600" />;
    if (method === 'upi') return <Smartphone size={14} className="text-purple-600" />;
    return <Wallet size={14} className="text-green-600" />;
  };

  const getDays = (start, end) =>
    Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <UserSidebar />

      <div className="md:ml-56 flex-1 p-4 md:p-8">
        <div className="mb-8 mt-16 md:mt-0">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">My Bookings</h1>
          <p className="text-gray-500">Track and manage your vehicle reservations</p>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 size={48} className="animate-spin text-blue-600" />
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl border border-red-200">{error}</div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car size={48} className="text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No bookings yet</h3>
            <p className="text-gray-500 mb-6">Start exploring vehicles to make your first booking</p>
            <button
              onClick={() => navigate('/vehicles')}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Browse Vehicles
            </button>
          </div>
        )}

        <div className="grid gap-5">
          {bookings.map((booking) => {
            const status = getStatusConfig(booking.status);
            const days = getDays(booking.startDate, booking.endDate);
            const isOpen = expanded === booking._id;

            return (
              <div key={booking._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                {/* Main Row */}
                <div className="flex flex-col md:flex-row gap-0">
                  {/* Vehicle Image */}
                  <div className="md:w-48 h-40 md:h-auto flex-shrink-0 bg-gray-100 flex items-center justify-center">
                    <img
                      src={getImageUrl(booking.vehicle?.images?.[0])}
                      alt={booking.vehicle?.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.parentNode.innerHTML = `<div class="w-full h-full flex flex-col items-center justify-center bg-gray-100"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg><p class="text-xs text-gray-400 mt-2">${booking.vehicle?.name || 'Vehicle'}</p></div>`;
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 p-5">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-800">
                            {booking.vehicle?.name || 'Vehicle'}
                          </h3>
                          <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                            {status.label}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-lg text-xs">
                            <Calendar size={13} className="text-blue-600" />
                            <span className="text-gray-700 font-medium">
                              {formatDate(booking.startDate)} → {formatDate(booking.endDate)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg text-xs">
                            <span className="text-gray-500">🗓</span>
                            <span className="text-gray-700 font-medium">{days} day{days > 1 ? 's' : ''}</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-lg text-xs">
                            <MapPin size={13} className="text-green-600" />
                            <span className="text-gray-700 font-medium">{booking.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            {getPaymentIcon(booking.paymentMethod)}
                            <span className="capitalize">{booking.paymentMethod || 'card'}</span>
                          </div>
                          <span>•</span>
                          <span className={`font-medium ${booking.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                            {booking.paymentStatus === 'paid' ? '✓ Paid' : '⏳ Payment Pending'}
                          </span>
                          {booking.needDriver && (
                            <>
                              <span>•</span>
                              <span className="text-blue-600">🚗 Driver Included</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Amount + Toggle */}
                      <div className="flex md:flex-col items-center md:items-end gap-3">
                        <div className="text-right">
                          <p className="text-xs text-gray-400 mb-0.5">Total Amount</p>
                          <p className="text-2xl font-bold text-blue-600">₹{booking.totalAmount?.toFixed(2)}</p>
                        </div>
                        <button
                          onClick={() => setExpanded(isOpen ? null : booking._id)}
                          className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition"
                        >
                          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          {isOpen ? 'Less' : 'Details'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isOpen && (
                  <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Vehicle Price/day</p>
                        <p className="font-semibold text-gray-700">₹{booking.vehicle?.price}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Driver Charges</p>
                        <p className="font-semibold text-gray-700">
                          {booking.driverCharges > 0 ? `₹${booking.driverCharges}` : 'None'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Late Penalty</p>
                        <p className={`font-semibold ${booking.latePenalty > 0 ? 'text-red-600' : 'text-gray-700'}`}>
                          {booking.latePenalty > 0 ? `₹${booking.latePenalty}` : 'None'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Booking ID</p>
                        <p className="font-mono text-xs text-gray-600 truncate">{booking._id}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
