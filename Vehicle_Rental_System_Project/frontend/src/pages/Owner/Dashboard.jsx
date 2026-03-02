import React, { useState, useEffect } from "react";
import OwnerSidebar from "../../components/OwnerSidebar";
import { Car, FileText, DollarSign, TrendingUp, Loader2, CheckCircle, Clock, XCircle, Users } from "lucide-react";
import { Link } from "react-router-dom";
import API from "../../services/api";

export default function OwnerDashboard() {
  const [stats, setStats] = useState({ vehicles: 0, bookings: 0, earnings: 0, monthEarnings: 0, pending: 0, approved: 0, rejected: 0, drivers: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
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
      
      setStats({
        vehicles: vehiclesRes.data.length,
        bookings: bookingsRes.data.filter(b => b.status === 'approved' || b.status === 'active').length,
        earnings: bookingsRes.data
          .filter(b => b.status === 'approved' || b.status === 'completed')
          .reduce((sum, b) => sum + (b.totalAmount || 0), 0),
        monthEarnings: bookingsRes.data
          .filter(b => {
            const isCurrentMonth = new Date(b.createdAt).getMonth() === new Date().getMonth();
            const isValidStatus = b.status === 'approved' || b.status === 'completed';
            return isCurrentMonth && isValidStatus;
          })
          .reduce((sum, b) => sum + (b.totalAmount || 0), 0),
        pending: bookingsRes.data.filter(b => b.status === 'pending').length,
        approved: bookingsRes.data.filter(b => b.status === 'approved').length,
        rejected: bookingsRes.data.filter(b => b.status === 'rejected').length,
        drivers: driversRes.data.length
      });
      
      setRecentBookings(bookingsRes.data.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (loading) return (
    <div className="flex"><OwnerSidebar /><div className="md:ml-56 flex-1 flex items-center justify-center h-screen"><Loader2 size={48} className="animate-spin text-indigo-600" /></div></div>
  );

  return (
    <div className="flex bg-gray-50">
      <OwnerSidebar />
      
      <div className="md:ml-56 flex-1 min-h-screen p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {userName}</h1>
          <p className="text-gray-600 flex items-center gap-2">
            <span className="text-green-500">📈</span> Everything looks good today.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link to="/owner/vehicles" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Car className="text-blue-600" size={28} />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide mb-1">Total Vehicles</h3>
            <p className="text-4xl font-bold text-gray-800 mb-3">{stats.vehicles}</p>
            <div className="flex gap-4 text-xs">
              <span className="text-green-600 font-medium">ACTIVE {stats.vehicles}</span>
            </div>
          </Link>
          
          <Link to="/owner/bookings" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <FileText className="text-green-600" size={28} />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide mb-1">Bookings</h3>
            <p className="text-4xl font-bold text-gray-800 mb-3">{stats.bookings}</p>
            <div className="flex gap-4 text-xs">
              <span className="text-yellow-600 font-medium">PENDING {stats.pending}</span>
              <span className="text-green-600 font-medium">APPROVED {stats.approved}</span>
            </div>
          </Link>
          
          <Link to="/owner/drivers" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Users className="text-purple-600" size={28} />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide mb-1">My Drivers</h3>
            <p className="text-4xl font-bold text-gray-800 mb-3">{stats.drivers}</p>
            <div className="flex gap-4 text-xs">
              <span className="text-purple-600 font-medium">TOTAL {stats.drivers}</span>
            </div>
          </Link>
          
          <Link to="/owner/earnings" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-xl">
                <DollarSign className="text-orange-600" size={28} />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide mb-1">Earnings</h3>
            <p className="text-4xl font-bold text-gray-800 mb-3">₹{stats.earnings}</p>
            <div className="flex gap-4 text-xs">
              <span className="text-green-600 font-medium">TOTAL</span>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/owner/bookings" className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg p-6 text-white hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <Clock size={32} />
              <span className="text-5xl font-bold">{stats.pending}</span>
            </div>
            <h3 className="text-lg font-semibold">Pending Requests</h3>
            <p className="text-yellow-100 text-sm">Awaiting your approval</p>
          </Link>
          
          <Link to="/owner/bookings" className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl shadow-lg p-6 text-white hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle size={32} />
              <span className="text-5xl font-bold">{stats.approved}</span>
            </div>
            <h3 className="text-lg font-semibold">Approved</h3>
            <p className="text-green-100 text-sm">Active bookings</p>
          </Link>
          
          <Link to="/owner/bookings" className="bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl shadow-lg p-6 text-white hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <XCircle size={32} />
              <span className="text-5xl font-bold">{stats.rejected}</span>
            </div>
            <h3 className="text-lg font-semibold">Rejected</h3>
            <p className="text-red-100 text-sm">Declined requests</p>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Requests</h2>
            <button className="text-blue-600 text-sm font-medium hover:underline">View All →</button>
          </div>
          
          {recentBookings.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto text-gray-300 mb-3" size={48} />
              <p className="text-gray-500 font-medium">No recent requests to review.</p>
            </div>
          ) : (
            <>
              <div className="md:hidden space-y-3">
                {recentBookings.map((booking) => (
                  <div key={booking._id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-gray-800">{booking.vehicle?.name}</p>
                        <p className="text-sm text-gray-500">{booking.user?.name}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'approved' ? 'bg-green-100 text-green-700' : 
                        booking.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                        booking.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>{booking.status.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-3">
                      <span className="text-gray-500">{formatDate(booking.startDate)}</span>
                      <span className="font-bold text-blue-600">₹{booking.totalAmount}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-2 text-sm font-semibold text-gray-600 uppercase tracking-wide">Vehicle</th>
                      <th className="text-left py-4 px-2 text-sm font-semibold text-gray-600 uppercase tracking-wide">Customer</th>
                      <th className="text-left py-4 px-2 text-sm font-semibold text-gray-600 uppercase tracking-wide">Date</th>
                      <th className="text-left py-4 px-2 text-sm font-semibold text-gray-600 uppercase tracking-wide">Amount</th>
                      <th className="text-left py-4 px-2 text-sm font-semibold text-gray-600 uppercase tracking-wide">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-2 font-medium text-gray-800">{booking.vehicle?.name}</td>
                        <td className="py-4 px-2 text-gray-600">{booking.user?.name}</td>
                        <td className="py-4 px-2 text-gray-600">{formatDate(booking.startDate)}</td>
                        <td className="py-4 px-2 font-bold text-blue-600">₹{booking.totalAmount}</td>
                        <td className="py-4 px-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'approved' ? 'bg-green-100 text-green-700' : 
                            booking.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                            booking.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>{booking.status.toUpperCase()}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
