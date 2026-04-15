import React, { useState, useEffect } from "react";
import UserSidebar from "../../components/UserSidebar";
import { Bell, Settings, Search, Car, Calendar, CreditCard, TrendingUp, MapPin, Loader2, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import API from "../../services/api";

export default function UserHome() {
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, completed: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const { data } = await API.get("/bookings/my-bookings");
      setRecentBookings(data.slice(0, 3));
      setStats({
        total: data.length,
        pending: data.filter(b => b.status === "pending").length,
        approved: data.filter(b => b.status === "approved").length,
        completed: data.filter(b => b.status === "completed").length,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      pending:   "bg-yellow-100 text-yellow-700",
      approved:  "bg-green-100 text-green-700",
      completed: "bg-blue-100 text-blue-700",
      rejected:  "bg-red-100 text-red-700",
      active:    "bg-purple-100 text-purple-700",
    };
    return map[status] || "bg-gray-100 text-gray-600";
  };

  if (loading) return (
    <div className="flex">
      <UserSidebar />
      <div className="md:ml-56 flex-1 flex items-center justify-center h-screen bg-gray-50">
        <Loader2 size={36} className="animate-spin text-green-600" />
      </div>
    </div>
  );

  const latestVehicle = recentBookings[0]?.vehicle?.name || "your vehicle";

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <UserSidebar />

      <div className="md:ml-56 flex-1 flex flex-col min-h-screen">

        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 mt-14 md:mt-0">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-64">
            <Search size={15} className="text-gray-400" />
            <input className="bg-transparent text-sm text-gray-600 outline-none w-full placeholder-gray-400" placeholder="Search vehicles or locations..." />
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition">
              <Bell size={16} className="text-gray-500" />
            </button>
            <button className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition">
              <Settings size={16} className="text-gray-500" />
            </button>
            <div className="flex items-center gap-2 ml-1">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-800">{user?.name || "User"}</p>
                <p className="text-xs text-green-600 font-medium">PREMIUM MEMBER</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm">
                {(user?.name || "U")[0].toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 gap-0">

          {/* Left + Center */}
          <div className="flex-1 p-6">

            {/* Welcome */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name?.split(" ")[0] || "User"}.</h1>
              <p className="text-gray-500 text-sm mt-1">Your {latestVehicle} is ready for pickup in Greenwich.</p>
            </div>

            {/* Stats + Hero Row */}
            <div className="grid grid-cols-3 gap-4 mb-6">

              {/* Total Bookings Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <TrendingUp size={18} className="text-green-600" />
                  </div>
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+12%</span>
                </div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Total Bookings</p>
                <p className="text-4xl font-bold text-gray-900">{stats.total}</p>
              </div>

              {/* Explore the Fleet Hero */}
              <div className="col-span-2 bg-gray-900 rounded-2xl p-5 flex items-center justify-between relative overflow-hidden">
                <div className="z-10">
                  <h2 className="text-white text-xl font-bold mb-1">Explore the Fleet</h2>
                  <p className="text-gray-400 text-xs mb-4 max-w-xs">Access our exclusive collection of high-performance electric and luxury vehicles.</p>
                  <Link to="/vehicles" className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
                    <Car size={15} />
                    Browse Vehicles
                  </Link>
                </div>
                {/* Decorative car silhouette */}
                <div className="absolute right-4 bottom-0 opacity-20">
                  <Car size={120} className="text-white" />
                </div>
              </div>
            </div>

            {/* Upcoming Quick Links */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Link to="/user/bookings" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between hover:shadow-md transition group">
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Upcoming</p>
                  <p className="text-lg font-bold text-gray-800">My Bookings</p>
                </div>
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition">
                  <Calendar size={18} className="text-green-600" />
                </div>
              </Link>
              <Link to="/user/payments" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between hover:shadow-md transition group">
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Wallet</p>
                  <p className="text-lg font-bold text-gray-800">Payments</p>
                </div>
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition">
                  <CreditCard size={18} className="text-green-600" />
                </div>
              </Link>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-800">Recent Activity</h2>
                <Link to="/user/bookings" className="text-green-600 text-sm font-medium hover:underline">View All History</Link>
              </div>

              {recentBookings.length === 0 ? (
                <div className="text-center py-12">
                  <Car size={36} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-400 text-sm">No recent bookings</p>
                  <Link to="/vehicles" className="mt-3 inline-block text-sm text-green-600 font-medium hover:underline">Browse Vehicles</Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {recentBookings.map((booking) => (
                    <div key={booking._id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition">
                      {/* Vehicle thumb */}
                      <div className="w-14 h-14 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
                        {booking.vehicle?.images?.[0] ? (
                          <img src={booking.vehicle.images[0]} alt="" className="w-full h-full object-cover" onError={e => { e.target.style.display='none'; }} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Car size={22} className="text-gray-400" /></div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-800 text-sm truncate">{booking.vehicle?.name || "Vehicle"}</p>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusBadge(booking.status)}`}>
                            {booking.status?.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar size={11} />
                            {new Date(booking.startDate).toLocaleDateString("en-GB", { day:"2-digit", month:"short" })} – {new Date(booking.endDate).toLocaleDateString("en-GB", { day:"2-digit", month:"short" })}
                          </span>
                          {booking.location && (
                            <span className="flex items-center gap-1">
                              <MapPin size={11} />
                              {booking.location}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-gray-800 text-sm">₹{booking.totalAmount?.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-72 p-6 pl-0 flex flex-col gap-4 hidden lg:flex">

            {/* Vehicle Status */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Vehicle Status</p>
              <div className="space-y-4">
                {recentBookings.slice(0, 2).map((b, i) => (
                  <div key={b._id}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-700 font-medium truncate max-w-[140px]">{b.vehicle?.name || "Vehicle"}</span>
                      <span className="text-gray-400 capitalize">{b.status}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${i === 0 ? "bg-green-500" : "bg-orange-400"}`}
                        style={{ width: b.status === "completed" ? "100%" : b.status === "approved" ? "80%" : b.status === "active" ? "60%" : "30%" }}
                      />
                    </div>
                  </div>
                ))}
                {recentBookings.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-2">No active vehicles</p>
                )}
              </div>
            </div>

            {/* Concierge Support */}
            <div className="bg-green-700 rounded-2xl p-5 text-white">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center mb-3">
                <MessageCircle size={18} className="text-white" />
              </div>
              <p className="font-bold text-base mb-1">Concierge Support</p>
              <p className="text-green-200 text-xs mb-4">Need help with your current booking or a special request? Your personal concierge is available 24/7.</p>
              <button className="w-full bg-white text-green-700 font-semibold text-sm py-2.5 rounded-xl hover:bg-green-50 transition">
                Start Private Chat
              </button>
            </div>

            {/* Efficiency Score */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={14} className="text-green-500" />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Efficiency Score</p>
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-1">
                {stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : "0.0"}
              </p>
              <p className="text-xs text-gray-400 mb-4">Top 5% of members this month</p>
              <div className="flex gap-1.5">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className={`flex-1 h-5 rounded-md ${i <= 3 ? "bg-green-500" : i === 4 ? "bg-green-300" : "bg-green-100"}`} />
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
