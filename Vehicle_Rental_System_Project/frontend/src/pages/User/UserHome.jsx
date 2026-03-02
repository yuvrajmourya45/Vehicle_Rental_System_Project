import React, { useState, useEffect } from "react";
import UserSidebar from "../../components/UserSidebar";
import { Car, FileText, CreditCard, Clock, Loader2, TrendingUp, Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import API from "../../services/api";

export default function UserHome() {
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, completed: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await API.get('/bookings/my-bookings');
      setRecentBookings(data.slice(0, 5));
      setStats({
        total: data.length,
        pending: data.filter(b => b.status === 'pending').length,
        approved: data.filter(b => b.status === 'approved').length,
        completed: data.filter(b => b.status === 'completed').length
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      approved: 'bg-green-100 text-green-700 border-green-200',
      completed: 'bg-purple-100 text-purple-700 border-purple-200',
      rejected: 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  if (loading) return (
    <div className="flex">
      <UserSidebar />
      <div className="md:ml-56 flex-1 flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <UserSidebar />
      
      <div className="md:ml-56 flex-1 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 mt-16 md:mt-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.name || 'User'}! 👋
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Here's what's happening with your bookings today.
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Total Bookings Card */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-2 sm:p-3 rounded-lg">
                <FileText className="text-blue-600" size={20} />
              </div>
              <TrendingUp className="text-gray-400" size={16} />
            </div>
            <p className="text-gray-500 text-xs sm:text-sm font-medium mb-1">TOTAL BOOKINGS</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">{stats.total}</h3>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <p className="text-yellow-600 font-bold">{stats.pending}</p>
                <p className="text-gray-500">PENDING</p>
              </div>
              <div className="text-center">
                <p className="text-green-600 font-bold">{stats.approved}</p>
                <p className="text-gray-500">APPROVED</p>
              </div>
              <div className="text-center">
                <p className="text-purple-600 font-bold">{stats.completed}</p>
                <p className="text-gray-500">DONE</p>
              </div>
            </div>
          </div>

          {/* Quick Action Cards */}
          <Link to="/vehicles" className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition group border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-2 sm:p-3 rounded-lg group-hover:bg-green-200 transition">
                <Car className="text-green-600" size={20} />
              </div>
            </div>
            <p className="text-gray-500 text-xs sm:text-sm font-medium mb-1">BROWSE VEHICLES</p>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Find Your Ride</h3>
            <p className="text-xs sm:text-sm text-gray-600">Explore available vehicles</p>
          </Link>

          <Link to="/user/bookings" className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition group border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-2 sm:p-3 rounded-lg group-hover:bg-blue-200 transition">
                <Clock className="text-blue-600" size={20} />
              </div>
            </div>
            <p className="text-gray-500 text-xs sm:text-sm font-medium mb-1">MY BOOKINGS</p>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">View All</h3>
            <p className="text-xs sm:text-sm text-gray-600">Track your reservations</p>
          </Link>

          <Link to="/user/payments" className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition group border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-2 sm:p-3 rounded-lg group-hover:bg-purple-200 transition">
                <CreditCard className="text-purple-600" size={20} />
              </div>
            </div>
            <p className="text-gray-500 text-xs sm:text-sm font-medium mb-1">PAYMENTS</p>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">History</h3>
            <p className="text-xs sm:text-sm text-gray-600">View payment records</p>
          </Link>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">Recent Bookings</h2>
              <Link 
                to="/user/bookings" 
                className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1 self-start sm:self-auto"
              >
                View All →
              </Link>
            </div>
          </div>
          
          <div className="p-4 sm:p-6">
            {recentBookings.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <Car size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 mb-3">No recent bookings to show.</p>
                <Link 
                  to="/vehicles" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                >
                  <Car size={16} />
                  Browse Vehicles
                </Link>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking._id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base sm:text-lg text-gray-800 truncate">
                          {booking.vehicle?.name || 'Vehicle'}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1 text-xs sm:text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>
                              {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            <span className="truncate">{booking.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                          {booking.status.toUpperCase()}
                        </span>
                        <p className="font-bold text-green-600 text-sm sm:text-base whitespace-nowrap">
                          ₹{booking.totalAmount}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
