import React, { useState, useEffect } from "react";
import UserSidebar from "../../components/UserSidebar";
import { Search, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import API from "../../services/api";

export default function BrowseVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const { data } = await API.get('/vehicles');
      setVehicles(data.filter(v => v.status === 'verified'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex"><UserSidebar /><div className="md:ml-56 flex-1 flex items-center justify-center h-screen"><Loader2 size={48} className="animate-spin text-green-600" /></div></div>
  );

  return (
    <div className="flex">
      <UserSidebar />
      
      <div className="md:ml-56 flex-1 bg-gray-100 min-h-screen p-4 md:p-8">
        <div className="flex items-center gap-3 mb-4 mt-12 md:mt-0">
          <Link to="/" className="p-2 hover:bg-gray-200 rounded-lg">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">Browse Vehicles</h1>
        </div>
        
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <div className="flex gap-3">
            <div className="flex-1 flex items-center border rounded-lg px-3 py-2">
              <Search size={20} className="text-gray-400 mr-2" />
              <input type="text" placeholder="Search vehicles..." className="w-full outline-none" />
            </div>
            <select className="border rounded-lg px-3 py-2">
              <option>All Categories</option>
              <option>Car</option>
              <option>Bike</option>
              <option>Bus</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 py-10">No vehicles available</p>
          ) : (
            vehicles.map((vehicle) => (
              <div key={vehicle._id} className="bg-white rounded-xl shadow overflow-hidden">
                <img src={vehicle.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'} alt={vehicle.name} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1">{vehicle.name}</h3>
                  <p className="text-xs text-gray-600 mb-3">{vehicle.seats} Seats • {vehicle.fuel}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-xl font-bold text-green-600">${vehicle.price}/day</p>
                    <Link to={`/vehicle/${vehicle._id}`} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
