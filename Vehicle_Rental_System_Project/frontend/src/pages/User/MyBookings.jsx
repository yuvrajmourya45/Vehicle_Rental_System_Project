import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserSidebar from "../../components/UserSidebar";
import { Calendar, MapPin, Loader2, Car, Search, ChevronRight, Star, Headphones } from "lucide-react";
import API from "../../services/api";
import { getImageUrl } from "../../utils/imageUtils";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("active");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await API.get("/bookings/my-bookings");
      setBookings(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const getDays = (start, end) =>
    Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));

  const getTabBookings = () => {
    const now = new Date();
    let filtered = bookings;
    if (tab === "active") filtered = bookings.filter(b => b.status === "approved" || b.status === "active" || b.status === "pending");
    else if (tab === "upcoming") filtered = bookings.filter(b => new Date(b.startDate) > now && b.status !== "rejected");
    else if (tab === "past") filtered = bookings.filter(b => b.status === "completed" || b.status === "rejected");
    if (search) filtered = filtered.filter(b => b.vehicle?.name?.toLowerCase().includes(search.toLowerCase()) || b.location?.toLowerCase().includes(search.toLowerCase()));
    return filtered;
  };

  const getStatusBadge = (status) => {
    const map = {
      approved:  { label: "IN PROGRESS", cls: "bg-green-500 text-white" },
      active:    { label: "IN PROGRESS", cls: "bg-green-500 text-white" },
      pending:   { label: "PENDING APPROVAL", cls: "bg-pink-500 text-white" },
      completed: { label: "COMPLETED", cls: "bg-blue-500 text-white" },
      rejected:  { label: "REJECTED", cls: "bg-red-500 text-white" },
    };
    return map[status] || { label: status?.toUpperCase(), cls: "bg-gray-400 text-white" };
  };

  const filtered = getTabBookings();

  if (loading) return (
    <div className="flex">
      <UserSidebar />
      <div className="md:ml-56 flex-1 flex items-center justify-center h-screen bg-gray-50">
        <Loader2 size={36} className="animate-spin text-green-600" />
      </div>
    </div>
  );

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <UserSidebar />

      <div className="md:ml-56 flex-1 p-6 mt-14 md:mt-0">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 border-l-4 border-green-500 pl-3">My Bookings</h1>
          <p className="text-gray-400 text-sm mt-1 pl-4">Track and manage your vehicle reservations</p>
        </div>

        {/* Tabs + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1 w-fit">
            {["active", "upcoming", "past"].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition ${
                  tab === t ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 w-full sm:w-56">
            <Search size={14} className="text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search reservations..."
              className="text-sm outline-none w-full text-gray-600 placeholder-gray-400"
            />
          </div>
        </div>

        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-200 mb-4 text-sm">{error}</div>}

        {/* Booking Cards */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <Car size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium mb-1">No bookings found</p>
            <p className="text-gray-400 text-sm mb-4">Try a different tab or make a new reservation</p>
            <button
              onClick={() => navigate("/vehicles")}
              className="px-5 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition"
            >
              Browse Vehicles
            </button>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            {filtered.map((booking) => {
              const badge = getStatusBadge(booking.status);
              const days = getDays(booking.startDate, booking.endDate);

              return (
                <div key={booking._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition">
                  <div className="flex flex-col md:flex-row">

                    {/* Image with status badge */}
                    <div className="relative md:w-64 h-48 md:h-auto flex-shrink-0">
                      {booking.vehicle?.images?.[0] ? (
                        <img
                          src={getImageUrl(booking.vehicle.images[0])}
                          alt={booking.vehicle?.name}
                          className="w-full h-full object-cover"
                          onError={e => { e.target.onerror = null; e.target.src = ""; }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <Car size={40} className="text-gray-300" />
                        </div>
                      )}
                      <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${badge.cls}`}>
                        {badge.label}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{booking.vehicle?.name || "Vehicle"}</h3>
                          <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                            <MapPin size={12} />
                            <span>{booking.location || "Location not specified"}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400 font-medium">TOTAL PRICE</p>
                          <p className="text-2xl font-bold text-gray-900">₹{booking.totalAmount?.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Schedule */}
                      <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5 mb-3 w-fit">
                        <Calendar size={14} className="text-green-600" />
                        <span className="text-xs font-medium text-gray-700">
                          {formatDate(booking.startDate)}
                        </span>
                        <span className="text-xs text-gray-400">→</span>
                        <span className="text-xs font-medium text-gray-700">
                          {formatDate(booking.endDate)}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">({days} day{days > 1 ? "s" : ""})</span>
                        <ChevronRight size={14} className="text-gray-400" />
                      </div>

                      {/* Meta row */}
                      <div className="flex flex-wrap gap-4 mb-4 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${booking.paymentStatus === "paid" ? "bg-green-500" : "bg-yellow-400"}`} />
                          <span className="text-gray-600 font-medium">
                            {booking.paymentStatus === "paid" ? "Payment Confirmed" : "Payment Pending"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-gray-600 font-medium">
                            {booking.needDriver ? "Driver Included" : "Self Drive"}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        {(booking.status === "approved" || booking.status === "active") && (
                          <button className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 rounded-xl transition">
                            Extend Rental
                          </button>
                        )}
                        {booking.status === "pending" && (
                          <button className="flex-1 bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold py-2.5 rounded-xl transition">
                            Modify Booking
                          </button>
                        )}
                        <button className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition">
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <Star size={16} className="text-green-600" />
              <p className="text-sm font-bold text-gray-800">Fleet Loyalty</p>
            </div>
            <p className="text-xs text-gray-500">You've reached Level 4. Next booking qualifies for free executive upgrade.</p>
          </div>
          <div className="bg-pink-50 rounded-2xl p-4 border border-pink-100">
            <div className="flex items-center gap-2 mb-2">
              <Headphones size={16} className="text-pink-600" />
              <p className="text-sm font-bold text-gray-800">24/7 Concierge</p>
            </div>
            <p className="text-xs text-gray-500">Your dedicated fleet manager is available for route planning and delivery adjustments.</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center justify-between hover:shadow-sm transition cursor-pointer" onClick={() => navigate("/user/bookings")}>
            <p className="text-sm font-bold text-green-600">View Past Reservation History</p>
            <ChevronRight size={16} className="text-green-600" />
          </div>
        </div>

        {/* New Reservation Button */}
        <div className="mt-6">
          <button
            onClick={() => navigate("/vehicles")}
            className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl text-sm transition shadow-sm"
          >
            + New Reservation
          </button>
        </div>

      </div>
    </div>
  );
}
