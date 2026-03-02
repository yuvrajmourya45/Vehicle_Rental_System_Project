import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Search, Filter, Users, Fuel, Star, Loader2 } from "lucide-react";
import API from "../../services/api";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ["All", "Car", "Bike", "Bus", "Truck"];

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    filterVehicles();
  }, [selectedCategory, searchQuery, vehicles]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/vehicles');
      setVehicles(data);
      setFilteredVehicles(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  const filterVehicles = () => {
    let filtered = vehicles;
    
    if (selectedCategory !== "All") {
      filtered = filtered.filter(v => v.category === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(v => 
        v.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredVehicles(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16 px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-3">Find Your Perfect Ride</h2>
          <p className="text-lg opacity-90">Choose from our premium collection of vehicles</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="px-4 md:px-8 py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-4 rounded-xl shadow-md flex flex-col md:flex-row gap-3 items-center mb-6">
            <div className="flex-1 flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-2.5 w-full focus-within:border-blue-500 transition">
              <Search size={20} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Search vehicles..." 
                className="outline-none w-full text-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg flex items-center gap-2 w-full md:w-auto justify-center hover:bg-blue-700 transition">
              <Filter size={18} /> Filter
            </button>
          </div>

          {/* Categories */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat 
                    ? "bg-blue-600 text-white" 
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 size={48} className="animate-spin text-blue-600" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-center">
              {error}
            </div>
          )}

          {/* No Results */}
          {!loading && !error && filteredVehicles.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No vehicles found</p>
            </div>
          )}

          {/* Vehicle Grid */}
          {!loading && !error && filteredVehicles.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map(vehicle => (
                <div key={vehicle._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="relative overflow-hidden">
                    <img 
                      src={vehicle.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'} 
                      alt={vehicle.name} 
                      className="h-48 w-full object-cover" 
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2 text-gray-800">{vehicle.name}</h3>
                    <div className="flex gap-3 text-sm text-gray-600 mb-4">
                      <span className="flex items-center gap-1">
                        <Users size={16} /> {vehicle.seats}
                      </span>
                      <span className="flex items-center gap-1">
                        <Fuel size={16} /> {vehicle.fuel}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">${vehicle.price}</p>
                        <span className="text-xs text-gray-500">per day</span>
                      </div>
                      <Link to={`/vehicle/${vehicle._id}`} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
