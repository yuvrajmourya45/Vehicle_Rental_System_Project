import React, { useState, useEffect } from "react";
import UserSidebar from "../../components/UserSidebar";
import { Calendar, MapPin, Loader2, Car } from "lucide-react";
import API from "../../services/api";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/bookings/my-bookings');
      setBookings(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-red-100 text-red-700';
    }
  };

  return (
    <div className="flex bg-gray-50">
      <UserSidebar />
      
      <div className="md:ml-56 flex-1 min-h-screen p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Bookings</h1>
          <p className="text-gray-600">Track and manage your vehicle reservations</p>
        </div>
        
        {loading && <div className="flex justify-center py-20"><Loader2 size={48} className="animate-spin text-indigo-600" /></div>}
        {error && <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl border border-red-200">{error}</div>}
        
        {!loading && !error && bookings.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <Car size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No bookings yet</h3>
            <p className="text-gray-500">Start exploring vehicles to make your first booking</p>
          </div>
        )}
        
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{booking.vehicle?.name || 'Vehicle'}</h3>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                      <Calendar size={16} className="text-blue-600" />
                      <span className="text-gray-700 font-medium">{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
                      <MapPin size={16} className="text-green-600" />
                      <span className="text-gray-700 font-medium">{booking.location}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                  {booking.status.toUpperCase()}
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-blue-600">₹{booking.totalAmount}</span>
                </div>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
