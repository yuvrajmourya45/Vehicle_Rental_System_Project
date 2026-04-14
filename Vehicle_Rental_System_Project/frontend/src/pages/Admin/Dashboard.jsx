import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { Users, UserCheck, Car, Loader2, DollarSign, Clock, ArrowUpRight, Bell, TrendingUp, FileText, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import API from "../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, owners: 0, vehicles: 0, activeBookings: 0, completedBookings: 0, pendingBookings: 0, monthlyRevenue: 0, totalDrivers: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
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
        monthlyRevenue: bookings.filter(b => new Date(b.createdAt).getMonth() === currentMonth && (b.status === 'approved' || b.status === 'completed')).reduce((sum, b) => sum + b.totalAmount, 0),
        totalDrivers: driversRes.data.length
      });
      setRecentBookings(bookings.slice(0, 6));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  if (loading) return (
    <div className="flex"><AdminSidebar /><div className="md:ml-56 flex-1 flex items-center justify-center h-screen bg-gray-50"><Loader2 size={48} className="animate-spin text-blue-600" /></div></div>
  );

  const statCards = [
    { label: "Total Users", value: stats.users, icon: Users, color: "blue", bg: "from-blue-500 to-blue-600", link: "/admin/users", sub: `${stats.users} active` },
    { label: "Total Owners", value: stats.owners, icon: UserCheck, color: "purple", bg: "from-purple-500 to-purple-600", link: "/admin/owners", sub: `${stats.owners} verified` },
    { label: "Total Vehicles", value: stats.vehicles, icon: Car, color: "green", bg: "from-green-500 to-green-600", link: "/admin/vehicles", sub: `${stats.vehicles} listed` },
    { label: "Total Bookings", value: stats.activeBookings + stats.completedBookings + stats.pendingBookings, icon: FileText, color: "orange", bg: "from-orange-500 to-orange-600", link: "/admin/bookings", sub: `${stats.pendingBookings} pending` },
  ];

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />
      <div className="md:ml-56 flex-1 p-4 md:p-8">

        {/* Header */}
        <div className="mb-8 mt-16 md:mt-0">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-2 rounded-lg"><Shield size={24} /></div>
                <span className="text-blue-100 font-medium">Admin Panel</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome Back, Admin! 👋</h1>
              <p className="text-blue-100 text-lg">Here's what's happening with CarRental today.</p>
              <div className="flex gap-6 mt-4 text-sm">
                <div><span className="text-blue-200">Revenue This Month</span><p className="text-2xl font-bold">₹{stats.monthlyRevenue.toLocaleString()}</p></div>
                <div><span className="text-blue-200">Pending Actions</span><p className="text-2xl font-bold">{stats.pendingBookings}</p></div>
              </div>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.label} to={card.link} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition-all hover:-translate-y-1 group">
                <div className="flex items-center justify-between mb-4">
                  <div className={`bg-gradient-to-br ${card.bg} p-3 rounded-xl shadow-md`}>
                    <Icon className="text-white" size={22} />
                  </div>
                  <ArrowUpRight size={18} className="text-gray-300 group-hover:text-gray-500 transition" />
                </div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1">{card.label}</p>
                <p className="text-3xl font-bold text-gray-800 mb-1">{card.value}</p>
                <p className="text-xs text-gray-400">{card.sub}</p>
              </Link>
            );
          })}
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <Link to="/admin/bookings" className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white/20 p-3 rounded-xl"><Clock size={28} /></div>
              <span className="text-5xl font-bold">{stats.pendingBookings}</span>
            </div>
            <h3 className="text-lg font-bold">Pending Requests</h3>
            <p className="text-yellow-100 text-sm mt-1">Bookings awaiting approval</p>
          </Link>

          <Link to="/admin/bookings" className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white/20 p-3 rounded-xl"><TrendingUp size={28} /></div>
              <span className="text-5xl font-bold">{stats.activeBookings}</span>
            </div>
            <h3 className="text-lg font-bold">Active Bookings</h3>
            <p className="text-green-100 text-sm mt-1">Currently ongoing rentals</p>
          </Link>

          <Link to="/admin/bookings" className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white/20 p-3 rounded-xl"><Users size={28} /></div>
              <span className="text-5xl font-bold">{stats.totalDrivers}</span>
            </div>
            <h3 className="text-lg font-bold">Total Drivers</h3>
            <p className="text-indigo-100 text-sm mt-1">Registered across all owners</p>
          </Link>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Bookings */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Recent Bookings</h2>
                <p className="text-sm text-gray-500 mt-0.5">Latest booking activity</p>
              </div>
              <Link to="/admin/bookings" className="text-blue-600 text-sm font-semibold hover:underline flex items-center gap-1">
                View All <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {recentBookings.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><Clock size={32} className="text-gray-400" /></div>
                  <p className="text-gray-500 font-medium">No recent bookings</p>
                </div>
              ) : recentBookings.map((booking) => (
                <div key={booking._id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {booking.vehicle?.name?.charAt(0) || 'V'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{booking.vehicle?.name || 'Vehicle'}</p>
                      <p className="text-xs text-gray-500">by {booking.user?.name} • {formatDate(booking.startDate)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800 text-sm">₹{booking.totalAmount}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      booking.status === 'approved' ? 'bg-green-100 text-green-700' :
                      booking.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      booking.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>{booking.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Card */}
          <div className="bg-gradient-to-br from-purple-600 to-blue-700 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white/20 p-2.5 rounded-xl"><DollarSign size={22} /></div>
              <div>
                <h3 className="font-bold text-lg">Revenue Stats</h3>
                <p className="text-purple-200 text-sm">Monthly overview</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white/15 rounded-xl p-4">
                <p className="text-purple-200 text-sm mb-1">This Month</p>
                <p className="text-3xl font-bold">₹{stats.monthlyRevenue.toLocaleString()}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/15 rounded-xl p-3 text-center">
                  <p className="text-purple-200 text-xs mb-1">Active</p>
                  <p className="text-2xl font-bold">{stats.activeBookings}</p>
                </div>
                <div className="bg-white/15 rounded-xl p-3 text-center">
                  <p className="text-purple-200 text-xs mb-1">Completed</p>
                  <p className="text-2xl font-bold">{stats.completedBookings}</p>
                </div>
              </div>
              <div className="bg-white/15 rounded-xl p-3 flex justify-between items-center">
                <span className="text-purple-200 text-sm">Pending</span>
                <span className="text-xl font-bold">{stats.pendingBookings}</span>
              </div>
              <div className="bg-white/15 rounded-xl p-3 flex justify-between items-center">
                <span className="text-purple-200 text-sm">Total Vehicles</span>
                <span className="text-xl font-bold">{stats.vehicles}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
