import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { Search, Check, X, Eye, Loader2, Car, Filter } from "lucide-react";
import API from "../../services/api";
import { getImageUrl } from "../../utils/imageUtils";
import { toast } from "react-toastify";

export default function ManageVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('pending');

  useEffect(() => { fetchVehicles(); }, []);

  const fetchVehicles = async () => {
    try {
      const { data } = await API.get('/admin/vehicles');
      setVehicles(data);
    } catch (err) {
      toast.error('Failed to load vehicles');
    } finally { setLoading(false); }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await API.put(`/admin/vehicles/${id}/status`, { status });
      setVehicles(vehicles.map(v => v._id === id ? { ...v, status } : v));
      toast.success(`Vehicle ${status}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const filtered = vehicles.filter(v =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (filter === 'all' || v.status === filter)
  );

  if (loading) return (
    <div className="flex"><AdminSidebar /><div className="md:ml-56 flex-1 flex items-center justify-center h-screen"><Loader2 size={48} className="animate-spin text-purple-600" /></div></div>
  );

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />
      <div className="md:ml-56 flex-1 p-4 md:p-8">

        {/* Header */}
        <div className="mb-8 mt-16 md:mt-0">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Manage Vehicles</h1>
          <p className="text-gray-500">Review and approve vehicle listings</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Pending', count: vehicles.filter(v => v.status === 'pending').length, color: 'yellow', status: 'pending' },
            { label: 'Verified', count: vehicles.filter(v => v.status === 'verified').length, color: 'green', status: 'verified' },
            { label: 'Rejected', count: vehicles.filter(v => v.status === 'rejected').length, color: 'red', status: 'rejected' },
          ].map((s) => (
            <button key={s.status} onClick={() => setFilter(s.status)}
              className={`bg-white rounded-xl p-4 border-2 transition text-left ${filter === s.status ? `border-${s.color}-500 shadow-md` : 'border-gray-100 hover:border-gray-300'}`}>
              <p className={`text-2xl font-bold text-${s.color}-600`}>{s.count}</p>
              <p className="text-sm text-gray-500 font-medium">{s.label}</p>
            </button>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-2.5 flex-1 focus-within:border-purple-500 transition">
            <Search size={18} className="text-gray-400" />
            <input type="text" placeholder="Search vehicles..." className="w-full outline-none text-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-purple-500">
            <option value="all">All Vehicles</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><Car size={40} className="text-gray-400" /></div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No vehicles found</h3>
            <p className="text-gray-500">No vehicles match your current filter</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((vehicle) => (
              <div key={vehicle._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition">
                <div className="relative h-48 overflow-hidden">
                  <img src={getImageUrl(vehicle.images?.[0])} alt={vehicle.name} className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=No+Image'; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
                    vehicle.status === 'verified' ? 'bg-green-500 text-white' :
                    vehicle.status === 'pending' ? 'bg-yellow-500 text-white' :
                    'bg-red-500 text-white'
                  }`}>{vehicle.status}</span>
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white font-bold text-lg leading-tight">{vehicle.name}</p>
                    <p className="text-white/80 text-xs">Owner: {vehicle.owner?.name || 'N/A'}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                    <span>⛽ {vehicle.fuel}</span>
                    <span>👥 {vehicle.seats} seats</span>
                    <span className="ml-auto font-bold text-purple-600 text-base">₹{vehicle.price}/day</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 text-sm font-medium transition">
                      <Eye size={15} /> View
                    </button>
                    {vehicle.status === 'pending' && (
                      <>
                        <button onClick={() => handleStatusUpdate(vehicle._id, 'verified')} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 text-sm font-medium transition">
                          <Check size={15} /> Approve
                        </button>
                        <button onClick={() => handleStatusUpdate(vehicle._id, 'rejected')} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-medium transition">
                          <X size={15} /> Reject
                        </button>
                      </>
                    )}
                    {vehicle.status === 'verified' && (
                      <button onClick={() => handleStatusUpdate(vehicle._id, 'rejected')} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 text-sm font-medium transition">
                        <X size={15} /> Revoke
                      </button>
                    )}
                    {vehicle.status === 'rejected' && (
                      <button onClick={() => handleStatusUpdate(vehicle._id, 'verified')} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 text-sm font-medium transition">
                        <Check size={15} /> Approve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
