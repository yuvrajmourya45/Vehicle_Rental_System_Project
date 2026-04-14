import React, { useState, useEffect } from "react";
import OwnerSidebar from "../../components/OwnerSidebar";
import { Car, FileText, DollarSign, Loader2, CheckCircle, Clock, XCircle, Users, TrendingUp, ArrowUpRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import { getImageUrl } from "../../utils/imageUtils";

export default function OwnerDashboard() {
  const [stats, setStats] = useState({ vehicles: 0, bookings: 0, earnings: 0, monthEarnings: 0, pending: 0, approved: 0, rejected: 0, drivers: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [myVehicles, setMyVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetchData();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserName(user.name || 'Owner');
  }, []);

  const fetchData = async () => {
    try {
      const [vehiclesRes, bookingsRes, driversRes] = await Promise.all([
        API.get('/vehicles/my-vehicles'),
        API.get('/bookings/owner-bookings'),
        API.get('/drivers')
      ]);
      setMyVehicles(vehiclesRes.data.slice(0, 3));
      setStats({
        vehicles: vehiclesRes.data.length,
        bookings: bookingsRes.data.filter(b => b.status === 'approved' || b.status === 'active').length,
        earnings: bookingsRes.data.filter(b => b.status === 'approved' || b.status === 'completed').reduce((sum, b) => sum + (b.totalAmount || 0), 0),
        monthEarnings: bookingsRes.data.filter(b => new Date(b.createdAt).getMonth() === new Date().getMonth() && (b.status === 'approved' || b.status === 'completed')).reduce((sum, b) => sum + (b.totalAmount || 0), 0),
        pending: bookingsRes.data.filter(b => b.status === 'pending').length,
        approved: bookingsRes.data.filter(b => b.status === 'approved').length,
        rejected: bookingsRes.data.filter(b => b.status === 'rejected').length,
        drivers: driversRes.data.length
      });
      setRecentBookings(bookingsRes.data.slice(0, 5));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (loading) return (
    <div className="flex"><OwnerSidebar /><div className="md:ml-56 flex-1 flex items-center justify-center h-screen bg-gray-50"><Loader2 size={48} className="animate-spin text-purple-600" /></div></div>
  );

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <OwnerSidebar />
      <div className="md:ml-56 flex-1 p-4 md:p-8">

        {/* Header Banner */}
        <div className="mb-8 mt-16 md:mt-0">
          <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-36 translate-x-36"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-purple-200 font-medium mb-1">Owner Dashboard</p>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome, {userName}! 🚗</h1>
                <p className="text-purple-100">Manage your vehicles and bookings from here.</p>
                <div className="flex gap-6 mt-4">
                  <div><p className="text-purple-200 text-sm">This Month</p><p className="text-2xl font-bold">₹{stats.monthEarnings.toLocaleString()}</p></div>
                  <div><p className="text-purple-200 text-sm">Total Earned</p><p className="text-2xl font-bold">₹{stats.earnings.toLocaleString()}</p></div>
                </div>
              </div>
              <Link to="/owner/add-vehicle" className="flex items-center gap-2 bg-white text-purple-600 px-5 py-3 rounded-xl font-bold hover:bg-purple-50 transition shadow-lg self-start md:self-auto">
                <Plus size={20} /> Add Vehicle
              </Link>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {[
            { label: "My Vehicles", value: stats.vehicles, icon: Car, bg: "from-blue-500 to-blue-600", link: "/owner/vehicles" },
            { label: "Active Bookings", value: stats.bookings, icon: FileText, bg: "from-green-500 to-green-600", link: "/owner/bookings" },
            { label: "My Drivers", value: stats.drivers, icon: Users, bg: "from-purple-500 to-purple-600", link: "/owner/drivers" },
            { label: "Total Earnings", value: `₹${stats.earnings}`, icon: DollarSign, bg: "from-orange-500 to-orange-600", link: "/owner/earnings" },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.label} to={card.link} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition hover:-translate-y-1 group">
                <div className="flex items-center justify-between mb-4">
                  <div className={`bg-gradient-to-br ${card.bg} p-3 rounded-xl shadow-md`}><Icon className="text-white" size={22} /></div>
                  <ArrowUpRight size={18} className="text-gray-300 group-hover:text-gray-500 transition" />
                </div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1">{card.label}</p>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              </Link>
            );
          })}
        </div>

        {/* Booking Status Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <Link to="/owner/bookings" className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition hover:-translate-y-1">
            <div className="flex justify-between items-start mb-3">
              <div className="bg-white/20 p-3 rounded-xl"><Clock size={26} /></div>
              <span className="text-5xl font-bold">{stats.pending}</span>
            </div>
            <h3 className="text-lg font-bold">Pending</h3>
            <p className="text-yellow-100 text-sm">Awaiting your approval</p>
          </Link>
          <Link to="/owner/bookings" className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition hover:-translate-y-1">
            <div className="flex justify-between items-start mb-3">
              <div className="bg-white/20 p-3 rounded-xl"><CheckCircle size={26} /></div>
              <span className="text-5xl font-bold">{stats.approved}</span>
            </div>
            <h3 className="text-lg font-bold">Approved</h3>
            <p className="text-green-100 text-sm">Active bookings</p>
          </Link>
          <Link to="/owner/bookings" className="bg-gradient-to-br from-red-400 to-pink-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition hover:-translate-y-1">
            <div className="flex justify-between items-start mb-3">
              <div className="bg-white/20 p-3 rounded-xl"><XCircle size={26} /></div>
              <span className="text-5xl font-bold">{stats.rejected}</span>
            </div>
            <h3 className="text-lg font-bold">Rejected</h3>
            <p className="text-red-100 text-sm">Declined requests</p>
          </Link>
        </div>

        {/* My Vehicles + Recent Bookings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Vehicles */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-800">My Vehicles</h2>
                <p className="text-sm text-gray-500 mt-0.5">Your listed vehicles</p>
              </div>
              <Link to="/owner/vehicles" className="text-purple-600 text-sm font-semibold hover:underline flex items-center gap-1">View All <ArrowUpRight size={16} /></Link>
            </div>
            <div className="p-4 space-y-3">
              {myVehicles.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4"><Car size={32} className="text-purple-400" /></div>
                  <p className="text-gray-500 font-medium mb-3">No vehicles added yet</p>
                  <Link to="/owner/add-vehicle" className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition">Add Your First Vehicle</Link>
                </div>
              ) : myVehicles.map((vehicle) => (
                <div key={vehicle._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                  <img src={getImageUrl(vehicle.images?.[0])} alt={vehicle.name} className="w-16 h-12 object-cover rounded-lg flex-shrink-0" onError={(e) => { e.target.src = 'https://via.placeholder.com/64x48?text=Car'; }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{vehicle.name}</p>
                    <p className="text-xs text-gray-500">{vehicle.category} • ₹{vehicle.price}/day</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${vehicle.availability === 'available' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {vehicle.availability}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Recent Requests</h2>
                <p className="text-sm text-gray-500 mt-0.5">Latest booking activity</p>
              </div>
              <Link to="/owner/bookings" className="text-purple-600 text-sm font-semibold hover:underline flex items-center gap-1">View All <ArrowUpRight size={16} /></Link>
            </div>
            <div className="divide-y divide-gray-50">
              {recentBookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><FileText size={32} className="text-gray-400" /></div>
                  <p className="text-gray-500 font-medium">No booking requests yet</p>
                </div>
              ) : recentBookings.map((booking) => (
                <div key={booking._id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {booking.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{booking.vehicle?.name}</p>
                      <p className="text-xs text-gray-500">{booking.user?.name} • {formatDate(booking.startDate)}</p>
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
        </div>
      </div>
    </div>
  );
}
