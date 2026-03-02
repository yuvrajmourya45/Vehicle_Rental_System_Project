import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { CheckCircle, Loader2 } from "lucide-react";
import API from "../../services/api";

export default function Confirmation() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      const { data } = await API.get(`/bookings/${id}`);
      console.log('Booking with driver:', data);
      setBooking(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 size={48} className="animate-spin text-blue-600" />
    </div>
  );

  if (!booking) return (
    <div className="min-h-screen flex items-center justify-center">Booking not found</div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="px-4 py-16 max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 text-center">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
          
          <h2 className="text-xl font-bold mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 text-xs mb-4">Confirmation email sent.</p>
          
          <div className="bg-gray-50 p-3 rounded-lg mb-4 text-left">
            <h3 className="font-semibold text-sm mb-2">Booking Details</h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Booking ID</span>
                <span className="font-semibold">#{booking._id.slice(-8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vehicle</span>
                <span className="font-semibold">{booking.vehicle?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pickup Date</span>
                <span className="font-semibold">{new Date(booking.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Return Date</span>
                <span className="font-semibold">{new Date(booking.endDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="text-gray-600">Total Paid</span>
                <span className="font-bold text-blue-600">${booking.totalAmount}</span>
              </div>
              {booking.assignedDriver && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs font-semibold text-purple-600 mb-2">🚗 Driver Assigned</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Name</span>
                      <span className="font-semibold">{booking.assignedDriver.name}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Phone</span>
                      <span className="font-semibold">{booking.assignedDriver.phone}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Experience</span>
                      <span className="font-semibold">{booking.assignedDriver.experience} years</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Link to="/vehicles" className="block w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 text-xs">
              Browse More Vehicles
            </Link>
            <Link to="/" className="block w-full py-2 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 text-xs">
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
