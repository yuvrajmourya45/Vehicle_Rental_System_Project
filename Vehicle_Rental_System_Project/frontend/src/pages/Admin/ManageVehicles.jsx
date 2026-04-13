import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { Search, Check, X, Eye, Loader2 } from "lucide-react";
import API from "../../services/api";
import { getImageUrl } from "../../utils/imageUtils";

export default function ManageVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/admin/vehicles');
      console.log('All vehicles:', data);
      console.log('Pending vehicles:', data.filter(v => v.status === 'pending'));
      setVehicles(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await API.put(`/admin/vehicles/${id}/status`, { status });
      setVehicles(vehicles.map(v => v._id === id ? {...v, status} : v));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const filteredVehicles = vehicles.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    v.status === 'pending'
  );

  return (
    <div className="flex">
      <AdminSidebar />
      
      <div className="md:ml-56 flex-1 bg-gray-100 min-h-screen p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 mt-12 md:mt-0">Vehicle Requests (Pending Approval)</h1>
        
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Search size={20} className="text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search vehicles..." 
              className="w-full outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading && <div className="flex justify-center py-20"><Loader2 size={48} className="animate-spin text-purple-600" /></div>}
        {error && <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg">{error}</div>}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVehicles.map((vehicle) => (
            <div key={vehicle._id} className="bg-white rounded-xl shadow overflow-hidden">
              <img 
                src={getImageUrl(vehicle.images?.[0])} 
                alt={vehicle.name} 
                className="w-full h-40 object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                }}
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold">{vehicle.name}</h3>
                    <p className="text-xs text-gray-600">Owner: {vehicle.owner?.name || 'N/A'}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    vehicle.status === "verified" 
                      ? "bg-green-100 text-green-600" 
                      : vehicle.status === "pending"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                  }`}>
                    {vehicle.status}
                  </span>
                </div>
                
                <p className="text-xl font-bold text-purple-600 mb-3">${vehicle.price}/day</p>

                <div className="flex gap-2">
                  <button className="flex-1 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 flex items-center justify-center gap-1 text-sm">
                    <Eye size={14} /> View
                  </button>
                  {vehicle.status === "pending" && (
                    <>
                      <button 
                        onClick={() => handleStatusUpdate(vehicle._id, 'verified')}
                        className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <Check size={14} />
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(vehicle._id, 'rejected')}
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <X size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
