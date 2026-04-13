import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Calendar, User, Mail, MapPin, Loader2 } from "lucide-react";
import API from "../../services/api";
import { toast } from 'react-toastify';
import { getImageUrl } from "../../utils/imageUtils";

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    pickupDate: "",
    returnDate: "",
    name: "",
    email: "",
    location: "",
    needDriver: false
  });

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  const fetchVehicle = async () => {
    try {
      const { data } = await API.get(`/vehicles/${id}`);
      setVehicle(data);
      if (data.availability === 'rented') {
        toast.error('This vehicle is already booked. Redirecting...');
        setTimeout(() => navigate(-1), 2000);
      }
    } catch (err) {
      console.error('Error fetching vehicle:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateDays = () => {
    if (!formData.pickupDate || !formData.returnDate) return 0;
    const days = Math.ceil((new Date(formData.returnDate) - new Date(formData.pickupDate)) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const calculateTotal = () => {
    const days = calculateDays();
    const vehicleSubtotal = days * (vehicle?.price || 0);
    const driverCharges = formData.needDriver ? days * 50 : 0;
    const subtotal = vehicleSubtotal + driverCharges;
    const tax = subtotal * 0.1;
    return { days, vehicleSubtotal, driverCharges, subtotal, tax, total: subtotal + tax };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (vehicle?.availability === 'rented') {
      toast.error('This vehicle is no longer available');
      return;
    }
    try {
      const bookingData = {
        vehicleId: id,
        startDate: formData.pickupDate,
        endDate: formData.returnDate,
        location: formData.location,
        needDriver: formData.needDriver,
        driverCharges: formData.needDriver ? calculateTotal().driverCharges : 0,
        totalAmount: total
      };
      const { data } = await API.post('/bookings', bookingData);
      navigate(`/payment/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"><Loader2 size={48} className="animate-spin text-blue-600" /></div>
  );

  if (!vehicle) return <div className="min-h-screen flex items-center justify-center">Vehicle not found</div>;

  const { days, vehicleSubtotal, driverCharges, subtotal, tax, total } = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="px-4 py-6 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Vehicle Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-4 sticky top-8">
              <h3 className="font-bold mb-2">Vehicle Details</h3>
              <img src={getImageUrl(vehicle.images?.[0])} alt="Vehicle" className="w-full h-28 object-cover rounded-lg mb-2" onError={(e) => { e.target.onerror = null; e.target.style.display='none'; }} />
              <h4 className="font-semibold text-sm mb-2">{vehicle.name}</h4>
              <div className="space-y-1 text-xs text-gray-600 mb-2">
                <div className="flex justify-between">
                  <span>Category</span>
                  <span className="font-semibold text-gray-800">{vehicle.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Seats</span>
                  <span className="font-semibold text-gray-800">{vehicle.seats} People</span>
                </div>
                <div className="flex justify-between">
                  <span>Fuel</span>
                  <span className="font-semibold text-gray-800">{vehicle.fuel}</span>
                </div>
              </div>
              
              <div className="border-t pt-2 space-y-1 text-xs">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price per day</span>
                  <span className="font-semibold">${vehicle.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Number of days</span>
                  <span className="font-semibold">{days}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Vehicle charges</span>
                  <span className="font-semibold">${vehicleSubtotal.toFixed(2)}</span>
                </div>
                {formData.needDriver && (
                  <div className="flex justify-between text-sm text-blue-600">
                    <span>Driver charges ($50/day)</span>
                    <span className="font-semibold">${driverCharges.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax & Fees (10%)</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t pt-2 mt-2">
                  <span>Total</span>
                  <span className="text-blue-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h3 className="font-bold text-lg mb-3">Booking Information</h3>
              
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2 text-sm text-gray-700">Rental Period</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Pickup Date</label>
                      <div className="flex items-center border border-gray-200 rounded-lg px-2 py-1.5 focus-within:border-blue-600">
                        <Calendar size={20} className="text-gray-400 mr-2" />
                        <input 
                          type="date" 
                          className="outline-none w-full"
                          value={formData.pickupDate}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setFormData({...formData, pickupDate: e.target.value, returnDate: ''})}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Return Date</label>
                      <div className="flex items-center border border-gray-200 rounded-lg px-2 py-1.5 focus-within:border-blue-600">
                        <Calendar size={20} className="text-gray-400 mr-2" />
                        <input 
                          type="date" 
                          className="outline-none w-full"
                          value={formData.returnDate}
                          min={formData.pickupDate || new Date().toISOString().split('T')[0]}
                          onChange={(e) => setFormData({...formData, returnDate: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-sm text-gray-700">Personal Information</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Full Name</label>
                      <div className="flex items-center border border-gray-200 rounded-lg px-2 py-1.5 focus-within:border-blue-600">
                        <User size={20} className="text-gray-400 mr-2" />
                        <input 
                          type="text" 
                          className="outline-none w-full" 
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Email Address</label>
                      <div className="flex items-center border border-gray-200 rounded-lg px-2 py-1.5 focus-within:border-blue-600">
                        <Mail size={20} className="text-gray-400 mr-2" />
                        <input 
                          type="email" 
                          className="outline-none w-full" 
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Pickup Location</label>
                      <div className="flex items-center border border-gray-200 rounded-lg px-2 py-1.5 focus-within:border-blue-600">
                        <MapPin size={20} className="text-gray-400 mr-2" />
                        <input 
                          type="text" 
                          className="outline-none w-full" 
                          placeholder="Enter pickup address"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
                      <label className="flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 text-blue-600 rounded mr-3"
                          checked={formData.needDriver}
                          onChange={(e) => setFormData({...formData, needDriver: e.target.checked})}
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-blue-900">Need a Driver? (+$50/day)</p>
                          <p className="text-xs text-blue-700">Professional driver with 10+ years experience</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 text-sm">
                  Proceed to Payment →
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
