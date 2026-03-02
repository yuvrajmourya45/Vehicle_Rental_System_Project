import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Loader2 } from "lucide-react";
import API from "../../services/api";

export default function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  const fetchVehicle = async () => {
    try {
      const { data } = await API.get(`/vehicles/${id}`);
      setVehicle(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"><Loader2 size={48} className="animate-spin text-blue-600" /></div>
  );

  if (!vehicle) return (
    <div className="min-h-screen flex items-center justify-center">Vehicle not found</div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="px-8 py-16 max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <img src={vehicle.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'} alt={vehicle.name} className="w-full h-96 object-cover" />
              
              <div className="p-6 bg-gray-50">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🛡️</div>
                    <p className="text-sm font-semibold">Fully Insured</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">🔧</div>
                    <p className="text-sm font-semibold">Well Maintained</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">📞</div>
                    <p className="text-sm font-semibold">24/7 Support</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <h1 className="text-3xl font-bold mb-4">{vehicle.name}</h1>
              <p className="text-gray-600 mb-6">{vehicle.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-100 p-4 rounded-xl">
                  <p className="text-sm text-gray-600">Seats</p>
                  <p className="font-semibold">{vehicle.seats} People</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-xl">
                  <p className="text-sm text-gray-600">Fuel</p>
                  <p className="font-semibold">{vehicle.fuel}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-xl">
                  <p className="text-sm text-gray-600">Transmission</p>
                  <p className="font-semibold">{vehicle.transmission}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-xl">
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-semibold">{vehicle.category}</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-gray-600">Price per day</p>
                    <p className="text-3xl font-bold text-blue-600">${vehicle.price}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                    <p className="text-sm text-green-600 font-semibold">✓ Available</p>
                    <p className="text-xs text-gray-600 mt-1">Ready to book</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => navigate(`/booking/${vehicle._id}`)}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
