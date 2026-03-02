import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { Users, UserCheck, Car, Loader2, DollarSign, CheckCircle, Clock, TrendingUp, ArrowUpRight, Bell } from "lucide-react";
import API from "../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ 
    users: 0, 
    owners: 0, 
    vehicles: 0, 
    activeBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
    monthlyRevenue: 0,
    totalDrivers: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [dashboardRes, bookingsRes, driversRes] = await Promise.all([
        API.get('/admin/dashboard'),
        API.get('/admin/bookings'),
        API.get('/admin/drivers')
      ]);
      
      const bookings = bookingsRes.data;
      const currentMonth = new Date().getMonth();
      
      setStats({
        users: dashboardRes.data.totalUsers,
        owners: dashboardRes.data.totalOwners,
        vehicles: dashboardRes.data.totalVehicles,
        activeBookings: bookings.filter(b => b.status === 'approved' || b.status === 'active').length,
        completedBookings: bookings.filter(b => b.status === 'completed').length,
        pendingBookings: bookings.filter(b => b.status === 'pending').length,
        monthlyRevenue: bookings
          .filter(b => {
            const bookingMonth = new Date(b.createdAt).getMonth();
            return bookingMonth === currentMonth && (b.status === 'approved' || b.status === 'completed');
          })
          .reduce((sum, b) => sum + b.totalAmount, 0),
        totalDrivers: driversRes.data.length
      });
      
      setRecentBookings(bookings.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  if (loading) return (
    <div className="flex"><AdminSidebar /><div className="md:ml-56 flex-1 flex items-center justify-center h-screen"><Loader2 size={48} className="animate-spin text-blue-600" /></div></div>
  );

  return (
    <div className="flex">
      <AdminSidebar />
      
      <div className="md:ml-56 flex-1 bg-gray-50 min-h-screen p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, Admin</h1>
          <p className="text-gray-600 flex items-center gap-2">
            <span className="text-green-500">📈</span>
            Everything looks good in CarRental today.
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6 relative overflow-hidden hover:shadow-md transition">
            <div className="absolute top-4 right-4 text-gray-300">
              <ArrowUpRight size={20} />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Users className="text-purple-600" size={24} />
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">TOTAL USERS</p>
            <p className="text-4xl font-bold text-gray-800 mb-4">{stats.users}</p>
            <div className="flex gap-4 text-xs">
              <div>
                <p className="text-green-600 font-semibold">ACTIVE</p>
                <p className="text-gray-800 font-bold">{stats.users}</p>
              </div>
              <div>
                <p className="text-gray-400 font-semibold">BLOCKED</p>
                <p className="text-gray-800 font-bold">0</p>
              </div>
            </div>
          </div>

          {/* Total Owners Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6 relative overflow-hidden hover:shadow-md transition">
            <div className="absolute top-4 right-4 text-gray-300">
              <ArrowUpRight size={20} />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <UserCheck className="text-blue-600" size={24} />
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">TOTAL OWNERS</p>
            <p className="text-4xl font-bold text-gray-800 mb-4">{stats.owners}</p>
            <div className="flex gap-4 text-xs">
              <div>
                <p className="text-green-600 font-semibold">VERIFIED</p>
                <p className="text-gray-800 font-bold">{stats.owners}</p>
              </div>
              <div>
                <p className="text-yellow-600 font-semibold">PENDING</p>
                <p className="text-gray-800 font-bold">0</p>
              </div>
            </div>
          </div>

          {/* Total Vehicles Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6 relative overflow-hidden hover:shadow-md transition">
            <div className="absolute top-4 right-4 text-gray-300">
              <ArrowUpRight size={20} />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <Car className="text-green-600" size={24} />
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">TOTAL VEHICLES</p>
            <p className="text-4xl font-bold text-gray-800 mb-4">{stats.vehicles}</p>
            <div className="flex gap-4 text-xs">
              <div>
                <p className="text-green-600 font-semibold">AVAILABLE</p>
                <p className="text-gray-800 font-bold">{stats.vehicles}</p>
              </div>
              <div>
                <p className="text-orange-600 font-semibold">RENTED</p>
                <p className="text-gray-800 font-bold">0</p>
              </div>
            </div>
          </div>

          {/* Bookings Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6 relative overflow-hidden hover:shadow-md transition">
            <div className="absolute top-4 right-4 text-gray-300">
              <ArrowUpRight size={20} />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-orange-100 p-3 rounded-xl">
                <Clock className="text-orange-600" size={24} />
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">BOOKINGS</p>
            <p className="text-4xl font-bold text-gray-800 mb-4">{stats.activeBookings + stats.completedBookings + stats.pendingBookings}</p>
            <div className="flex gap-4 text-xs">
              <div>
                <p className="text-yellow-600 font-semibold">PENDING</p>
                <p className="text-gray-800 font-bold">{stats.pendingBookings}</p>
              </div>
              <div>
                <p className="text-green-600 font-semibold">ACTIVE</p>
                <p className="text-gray-800 font-bold">{stats.activeBookings}</p>
              </div>
              <div>
                <p className="text-blue-600 font-semibold">DONE</p>
                <p className="text-gray-800 font-bold">{stats.completedBookings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Drivers Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <Users size={28} />
              </div>
              <span className="text-5xl font-bold">{stats.totalDrivers}</span>
            </div>
            <h3 className="text-lg font-semibold">Total Drivers</h3>
            <p className="text-indigo-100 text-sm">Registered across all owners</p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <Bell size={28} />
              </div>
              <span className="text-5xl font-bold">{stats.pendingBookings}</span>
            </div>
            <h3 className="text-lg font-semibold">Pending Actions</h3>
            <p className="text-orange-100 text-sm">Bookings awaiting approval</p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Bookings */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">RECENT BOOKINGS</h2>
              <button className="text-blue-600 text-sm font-semibold hover:underline flex items-center gap-1">
                View All <ArrowUpRight size={16} />
              </button>
            </div>
            
            {recentBookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-300 mb-4">
                  <Clock size={48} className="mx-auto" />
                </div>
                <p className="text-gray-400 font-medium">NO RECENT BOOKINGS TO REVIEW.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <div key={booking._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center">
                        <Car className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{booking.vehicle?.name}</p>
                        <p className="text-sm text-gray-500">by {booking.user?.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">${booking.totalAmount}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        booking.status === 'approved' ? 'bg-green-100 text-green-700' : 
                        booking.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                        booking.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Latest Notice */}
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign size={24} />
              <div>
                <h3 className="font-bold text-lg">REVENUE STATS</h3>
                <p className="text-sm text-purple-100">Monthly earnings overview</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white bg-opacity-20 rounded-xl p-4">
                <p className="text-sm text-purple-100 mb-1">This Month</p>
                <p className="text-3xl font-bold">${stats.monthlyRevenue}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white bg-opacity-20 rounded-xl p-3">
                  <p className="text-xs text-purple-100 mb-1">Active</p>
                  <p className="text-xl font-bold">{stats.activeBookings}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-xl p-3">
                  <p className="text-xs text-purple-100 mb-1">Completed</p>
                  <p className="text-xl font-bold">{stats.completedBookings}</p>
                </div>
              </div>

              <div className="bg-white bg-opacity-20 rounded-xl p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Pending Approvals</span>
                  <span className="text-xl font-bold">{stats.pendingBookings}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
