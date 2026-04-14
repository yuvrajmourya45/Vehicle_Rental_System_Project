import React, { useState, useEffect } from "react";
import OwnerSidebar from "../../components/OwnerSidebar";
import { Edit, Trash2, Loader2, Plus, Car, Search } from "lucide-react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import { getImageUrl } from "../../utils/imageUtils";
import { toast } from "react-toastify";

export default function MyVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchVehicles(); }, []);

  const fetchVehicles = async () => {
    try {
      const { data } = await API.get('/vehicles/my-vehicles');
      setVehicles(data);
    } catch (err) {
      toast.error('Failed to load vehicles');
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vehicle?')) return;
    try {
      await API.delete(`/vehicles/${id}`);
      setVehicles(vehicles.filter(v => v._id !== id));
      toast.success('Vehicle deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const filtered = vehicles.filter(v => v.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return (
    <div className="flex"><OwnerSidebar /><div className="md:ml-56 flex-1 flex items-center justify-center h-screen"><Loader2 size={48} className="animate-spin text-purple-600" /></div></div>
  );

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <OwnerSidebar />
      <div className="md:ml-56 flex-1 p-4 md:p-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 mt-16 md:mt-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Vehicles</h1>
            <p className="text-gray-500 mt-1">{vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} listed</p>
          </div>
          <Link to="/owner/add-vehicle" className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition shadow-md self-start sm:self-auto">
            <Plus size={18} /> Add Vehicle
          </Link>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-2.5 focus-within:border-purple-500 transition">
            <Search size={18} className="text-gray-400" />
            <input type="text" placeholder="Search vehicles..." className="w-full outline-none text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4"><Car size={40} className="text-purple-400" /></div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No vehicles found</h3>
            <p className="text-gray-500 mb-6">Add your first vehicle to start earning</p>
            <Link to="/owner/add-vehicle" className="px-6 py-2.5 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition">Add Vehicle</Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((vehicle) => (
              <div key={vehicle._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition hover:-translate-y-1 group">
                <div className="relative h-48 overflow-hidden">
                  <img src={getImageUrl(vehicle.images?.[0])} alt={vehicle.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=No+Image'; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${vehicle.availability === 'available' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
                    {vehicle.availability}
                  </span>
                  <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-semibold text-gray-700">{vehicle.category}</span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{vehicle.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                    <span>⛽ {vehicle.fuel}</span>
                    <span>👥 {vehicle.seats} seats</span>
                    <span>⚙️ {vehicle.transmission}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-2xl font-bold text-purple-600">₹{vehicle.price}</p>
                      <p className="text-xs text-gray-400">per day</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(vehicle._id)} className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition"><Trash2 size={16} /></button>
                    </div>
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
