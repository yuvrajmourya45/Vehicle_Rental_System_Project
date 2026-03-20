import React, { useState, useEffect } from "react";
import OwnerSidebar from "../../components/OwnerSidebar";
import { Edit, Trash2, Loader2 } from "lucide-react";
import API from "../../services/api";
import { getImageUrl } from "../../utils/imageUtils";

export default function MyVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/vehicles/my-vehicles');
      console.log('My vehicles:', data);
      data.forEach(vehicle => {
        console.log(`My Vehicle: ${vehicle.name}, Images:`, vehicle.images);
      });
      setVehicles(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await API.delete(`/vehicles/${id}`);
      setVehicles(vehicles.filter(v => v._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div className="flex">
      <OwnerSidebar />
      
      <div className="md:ml-56 flex-1 bg-gray-100 min-h-screen p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 mt-12 md:mt-0">My Vehicles</h1>
        
        {loading && <div className="flex justify-center py-20"><Loader2 size={48} className="animate-spin text-blue-600" /></div>}
        {error && <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg">{error}</div>}
        
        {!loading && !error && vehicles.length === 0 && (
          <div className="text-center py-20 text-gray-500">No vehicles added yet</div>
        )}
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((vehicle) => (
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
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold">{vehicle.name}</h3>
                    <p className="text-gray-600 text-xs">{vehicle.category}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    vehicle.availability === "available" 
                      ? "bg-green-100 text-green-600" 
                      : "bg-yellow-100 text-yellow-600"
                  }`}>
                    {vehicle.availability}
                  </span>
                </div>
                
                <div className="mb-3">
                  <p className="text-xl font-bold text-blue-600">${vehicle.price}/day</p>
                  <p className="text-xs text-gray-600">{vehicle.bookingCount || 0} bookings</p>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 flex items-center justify-center gap-1 text-sm">
                    <Edit size={14} /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(vehicle._id)}
                    className="flex-1 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center gap-1 text-sm"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
