import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Search, Filter, Users, Fuel, Star, Loader2, Grid, List } from "lucide-react";
import API from "../../services/api";
import { getImageUrl } from "../../utils/imageUtils";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

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
      console.log('Fetched vehicles:', data);
      data.forEach(vehicle => {
        console.log(`Vehicle: ${vehicle.name}, Images:`, vehicle.images);
      });
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
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 sm:py-16 lg:py-20">
        <div className="container-responsive text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3">
            Find Your Perfect Ride
          </h2>
          <p className="text-sm sm:text-base lg:text-lg opacity-90 max-w-2xl mx-auto">
            Choose from our premium collection of vehicles
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-gray-50 py-6 sm:py-8">
        <div className="container-responsive">
          {/* Search Bar */}
          <div className="bg-white p-3 sm:p-4 rounded-xl shadow-md mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <div className="flex-1 flex items-center gap-3 border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 focus-within:border-blue-500 transition">
                <Search size={18} className="text-gray-400 flex-shrink-0" />
                <input 
                  type="text" 
                  placeholder="Search vehicles..." 
                  className="outline-none w-full text-gray-700 text-sm sm:text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <button className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition text-sm sm:text-base">
                  <Filter size={16} /> Filter
                </button>
                <div className="hidden sm:flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2.5 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition`}
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2.5 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold whitespace-nowrap transition text-sm sm:text-base ${
                  selectedCategory === cat 
                    ? "bg-blue-600 text-white shadow-md" 
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results Count */}
          {!loading && !error && (
            <div className="mb-4 sm:mb-6">
              <p className="text-sm sm:text-base text-gray-600">
                {filteredVehicles.length} vehicle{filteredVehicles.length !== 1 ? 's' : ''} found
                {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-16 sm:py-20">
              <div className="text-center">
                <Loader2 size={40} className="animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading vehicles...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 sm:px-6 py-4 rounded-xl text-center">
              <p className="font-medium mb-2">Oops! Something went wrong</p>
              <p className="text-sm">{error}</p>
              <button 
                onClick={fetchVehicles}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
              >
                Try Again
              </button>
            </div>
          )}

          {/* No Results */}
          {!loading && !error && filteredVehicles.length === 0 && (
            <div className="text-center py-16 sm:py-20">
              <div className="text-6xl sm:text-8xl mb-4">🚗</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">No vehicles found</h3>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">Try adjusting your search or filter criteria</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Vehicle Grid/List */}
          {!loading && !error && filteredVehicles.length > 0 && (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" 
              : "space-y-4 sm:space-y-6"
            }>
              {filteredVehicles.map(vehicle => (
                <div 
                  key={vehicle._id} 
                  className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 ${
                    viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
                  }`}
                >
                  <div className={`relative overflow-hidden ${
                    viewMode === 'list' ? 'sm:w-64 sm:flex-shrink-0' : ''
                  }`}>
                    <img 
                      src={getImageUrl(vehicle.images?.[0])} 
                      alt={vehicle.name} 
                      className={`w-full object-cover ${
                        viewMode === 'list' ? 'h-48 sm:h-full' : 'h-40 sm:h-48'
                      }`}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium text-gray-700">
                      {vehicle.category}
                    </div>
                  </div>
                  
                  <div className={`p-3 sm:p-4 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
                    <div>
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-2 text-gray-800 line-clamp-2">
                        {vehicle.name}
                      </h3>
                      
                      <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                        <span className="flex items-center gap-1">
                          <Users size={14} className="sm:w-4 sm:h-4" /> 
                          {vehicle.seats} seats
                        </span>
                        <span className="flex items-center gap-1">
                          <Fuel size={14} className="sm:w-4 sm:h-4" /> 
                          {vehicle.fuel}
                        </span>
                        {vehicle.rating && (
                          <span className="flex items-center gap-1">
                            <Star size={14} className="sm:w-4 sm:h-4 text-yellow-500" /> 
                            {vehicle.rating}
                          </span>
                        )}
                      </div>
                      
                      {vehicle.description && viewMode === 'list' && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{vehicle.description}</p>
                      )}
                    </div>
                    
                    <div className={`flex justify-between items-center pt-3 border-t ${
                      viewMode === 'list' ? 'sm:pt-0 sm:border-t-0 sm:mt-auto' : ''
                    }`}>
                      <div>
                        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">
                          ${vehicle.price}
                        </p>
                        <span className="text-xs text-gray-500">per day</span>
                      </div>
                      <Link 
                        to={`/vehicle/${vehicle._id}`} 
                        className="px-3 sm:px-4 lg:px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-xs sm:text-sm lg:text-base whitespace-nowrap"
                      >
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
