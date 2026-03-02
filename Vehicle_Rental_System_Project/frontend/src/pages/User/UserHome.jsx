import React, { useState, useEffect } from "react";
import UserSidebar from "../../components/UserSidebar";
import { Car, FileText, CreditCard, Clock, Loader2 } from "lucide-react";
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
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      completed: 'bg-purple-100 text-purple-700',
      rejected: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) return (
    <div className="flex"><UserSidebar /><div className="md:ml-56 flex-1 flex items-center justify-center h-screen"><Loader2 size={48} className="animate-spin text-green-600" /></div></div>
  );

  return (
    <div className="flex">
      <UserSidebar />
      
      <div className="md:ml-56 flex-1 bg-gray-100 min-h-screen p-4 md:p-8">
        <div className="mb-6 mt-12 md:mt-0">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.name || 'User'}</h1>
          <p className="text-gray-600 mt-1">🚗 Everything looks good in your dashboard today.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="text-blue-600" size={24} />
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">TOTAL BOOKINGS</p>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">{stats.total}</h3>
            <div className="flex justify-between text-xs">
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

          <Link to="/vehicles" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition">
                <Car className="text-green-600" size={24} />
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">BROWSE VEHICLES</p>
            <h3 className="text-xl font-bold text-gray-800">Find Your Ride</h3>
            <p className="text-sm text-gray-600 mt-2">Explore available vehicles</p>
          </Link>

          <Link to="/user/bookings" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition">
                <Clock className="text-blue-600" size={24} />
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">MY BOOKINGS</p>
            <h3 className="text-xl font-bold text-gray-800">View All</h3>
            <p className="text-sm text-gray-600 mt-2">Track your reservations</p>
          </Link>

          <Link to="/user/payments" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition">
                <CreditCard className="text-purple-600" size={24} />
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">PAYMENTS</p>
            <h3 className="text-xl font-bold text-gray-800">History</h3>
            <p className="text-sm text-gray-600 mt-2">View payment records</p>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">RECENT BOOKINGS</h2>
            <Link to="/user/bookings" className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1">
              View All →
            </Link>
          </div>
          
          {recentBookings.length === 0 ? (
            <div className="text-center py-12">
              <Car size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">NO RECENT BOOKINGS TO SHOW.</p>
              <Link to="/vehicles" className="text-green-600 hover:text-green-700 font-medium mt-2 inline-block">
                Browse Vehicles
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking._id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{booking.vehicle?.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Location: {booking.location}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      <p className="font-bold text-green-600 mt-2">₹{booking.totalAmount}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
