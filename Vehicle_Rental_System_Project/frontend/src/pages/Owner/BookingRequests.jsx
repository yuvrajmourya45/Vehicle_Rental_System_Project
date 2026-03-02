import React, { useState, useEffect } from "react";
import OwnerSidebar from "../../components/OwnerSidebar";
import { Check, X, Loader2, Calendar, User, DollarSign, CreditCard, Clock, AlertCircle } from "lucide-react";
import API from "../../services/api";
import { toast } from 'react-toastify';

export default function BookingRequests() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [extendModal, setExtendModal] = useState(null);
  const [returnModal, setReturnModal] = useState(null);
  const [driverModal, setDriverModal] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [extendDate, setExtendDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  useEffect(() => {
    fetchBookings();
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const { data } = await API.get('/drivers');
      setDrivers(data.filter(d => d.isAvailable));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBookings = async () => {
    try {
      const { data } = await API.get('/bookings/owner-bookings');
      console.log('Bookings data:', data);
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id, status) => {
    try {
      const booking = bookings.find(b => b._id === id);
      if (status === 'approved' && booking.needDriver && !booking.assignedDriver) {
        setDriverModal(id);
        return;
      }
      await API.put(`/bookings/${id}/status`, { status });
      setBookings(bookings.map(b => b._id === id ? {...b, status} : b));
      toast.success(`Booking ${status} successfully!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  const handleAssignDriver = async () => {
    if (!selectedDriver) {
      toast.error('Please select a driver');
      return;
    }
    try {
      await API.put(`/bookings/${driverModal}/status`, { 
        status: 'approved',
        assignedDriver: selectedDriver 
      });
      setBookings(bookings.map(b => b._id === driverModal ? {...b, status: 'approved', assignedDriver: selectedDriver} : b));
      toast.success('Driver assigned and booking approved!');
      setDriverModal(null);
      setSelectedDriver('');
      fetchDrivers();
    } catch (err) {
      toast.error('Failed to assign driver');
    }
  };

  const handlePaymentReceived = async (id) => {
    try {
      await API.put(`/bookings/${id}/status`, { paymentStatus: 'paid' });
      setBookings(bookings.map(b => b._id === id ? {...b, paymentStatus: 'paid'} : b));
      toast.success('Payment marked as paid!');
    } catch (err) {
      toast.error('Failed to update payment status');
    }
  };

  const handleExtendBooking = async () => {
    try {
      const { data } = await API.put(`/bookings/${extendModal}/status`, { extendEndDate: extendDate });
      setBookings(bookings.map(b => b._id === extendModal ? data : b));
      setExtendModal(null);
      setExtendDate('');
      toast.success('Booking extended successfully!');
    } catch (err) {
      toast.error('Failed to extend booking');
    }
  };

  const handleReturnVehicle = async () => {
    try {
      const { data } = await API.put(`/bookings/${returnModal}/status`, { 
        actualReturnDate: returnDate,
        status: 'completed'
      });
      setBookings(bookings.map(b => b._id === returnModal ? data : b));
      setReturnModal(null);
      setReturnDate('');
      if (data.latePenalty > 0) {
        toast.warning(`Vehicle returned with late penalty: $${data.latePenalty}`);
      } else {
        toast.success('Vehicle returned successfully!');
      }
    } catch (err) {
      toast.error('Failed to mark return');
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (loading) return (
    <div className="flex"><OwnerSidebar /><div className="md:ml-56 flex-1 flex items-center justify-center h-screen"><Loader2 size={48} className="animate-spin text-blue-600" /></div></div>
  );

  return (
    <div className="flex">
      <OwnerSidebar />
      
      <div className="md:ml-56 flex-1 bg-gray-100 min-h-screen p-4 md:p-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 mb-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Booking Requests</h1>
          <p className="text-blue-100">Manage your vehicle bookings</p>
        </div>
        
        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No booking requests</h3>
            <p className="text-gray-500">You'll see booking requests here when customers book your vehicles</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{booking.vehicle?.name}</h3>
                    <div className="flex items-center gap-2 text-gray-600">
                      <User size={18} />
                      <span className="font-medium">{booking.user?.name}</span>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-xl text-sm font-bold border-2 ${
                    booking.status === "pending" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : 
                    booking.status === "approved" ? "bg-green-50 text-green-700 border-green-200" :
                    booking.status === "active" ? "bg-blue-50 text-blue-700 border-blue-200" :
                    booking.status === "completed" ? "bg-gray-50 text-gray-700 border-gray-200" :
                    "bg-red-50 text-red-700 border-red-200"
                  }`}>
                    {booking.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                      <Calendar size={20} />
                      <span className="text-sm font-semibold">Rental Period</span>
                    </div>
                    <p className="text-sm font-medium text-gray-700">{formatDate(booking.startDate)}</p>
                    <p className="text-sm font-medium text-gray-700">{formatDate(booking.endDate)}</p>
                    {booking.actualReturnDate && (
                      <p className="text-xs text-red-600 mt-1">Returned: {formatDate(booking.actualReturnDate)}</p>
                    )}
                  </div>

                  <div className="bg-green-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-green-600 mb-2">
                      <DollarSign size={20} />
                      <span className="text-sm font-semibold">Amount</span>
                    </div>
                    <p className="text-2xl font-bold text-green-700">${booking.totalAmount}</p>
                    {booking.driverCharges > 0 && (
                      <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                        🚗 Driver: ${booking.driverCharges}
                      </p>
                    )}
                    {booking.latePenalty > 0 && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        Late Penalty: ${booking.latePenalty}
                      </p>
                    )}
                  </div>

                  <div className="bg-purple-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-purple-600 mb-2">
                      <CreditCard size={20} />
                      <span className="text-sm font-semibold">Payment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        booking.paymentMethod === "cash" ? "bg-green-100 text-green-700" : 
                        booking.paymentMethod === "card" ? "bg-blue-100 text-blue-700" :
                        booking.paymentMethod === "upi" ? "bg-purple-100 text-purple-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {booking.paymentMethod?.toUpperCase() || 'N/A'}
                      </span>
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        booking.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {booking.paymentStatus === 'paid' ? 'PAID' : 'PENDING'}
                      </span>
                    </div>
                  </div>
                </div>

                {booking.needDriver && (
                  <div className="bg-purple-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-purple-600 mb-2">
                      <User size={20} />
                      <span className="text-sm font-semibold">Driver Required</span>
                    </div>
                    {booking.assignedDriver ? (
                      <div className="text-sm">
                        <p className="font-medium text-gray-700">{drivers.find(d => d._id === booking.assignedDriver)?.name || 'Driver Assigned'}</p>
                        <p className="text-xs text-gray-500">Driver has been assigned</p>
                      </div>
                    ) : (
                      <p className="text-xs text-orange-600 font-medium">⚠️ Driver not assigned yet</p>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-4 border-t-2 border-gray-100">
                  {booking.status === "pending" && (
                    <>
                      <button 
                        onClick={() => handleStatus(booking._id, 'approved')} 
                        className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
                      >
                        <Check size={20} />
                        Approve
                      </button>
                      <button 
                        onClick={() => handleStatus(booking._id, 'rejected')} 
                        className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
                      >
                        <X size={20} />
                        Reject
                      </button>
                    </>
                  )}
                  {(booking.status === "approved" || booking.status === "active") && (
                    <>
                      <button 
                        onClick={() => setExtendModal(booking._id)}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                      >
                        <Clock size={20} />
                        Extend Booking
                      </button>
                      <button 
                        onClick={() => setReturnModal(booking._id)}
                        className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition"
                      >
                        <Check size={20} />
                        Mark Returned
                      </button>
                    </>
                  )}
                  {booking.paymentStatus === 'pending' && (
                    <button 
                      onClick={() => handlePaymentReceived(booking._id)}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
                    >
                      Mark as Paid
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Extend Booking Modal */}
      {extendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Extend Booking</h3>
            <label className="block text-sm text-gray-600 mb-2">New End Date</label>
            <input 
              type="date" 
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 mb-4"
              value={extendDate}
              onChange={(e) => setExtendDate(e.target.value)}
            />
            <div className="flex gap-3">
              <button 
                onClick={handleExtendBooking}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
              >
                Extend
              </button>
              <button 
                onClick={() => setExtendModal(null)}
                className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Vehicle Modal */}
      {returnModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Mark Vehicle Returned</h3>
            <label className="block text-sm text-gray-600 mb-2">Actual Return Date</label>
            <input 
              type="date" 
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 mb-4"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />
            <p className="text-xs text-gray-500 mb-4">If returned late, penalty will be calculated automatically (1.5x daily rate)</p>
            <div className="flex gap-3">
              <button 
                onClick={handleReturnVehicle}
                className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700"
              >
                Confirm Return
              </button>
              <button 
                onClick={() => setReturnModal(null)}
                className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Driver Modal */}
      {driverModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Assign Driver</h3>
            <p className="text-sm text-gray-600 mb-4">Select a driver for this booking</p>
            {drivers.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4">No available drivers</p>
                <button 
                  onClick={() => window.location.href = '/owner/drivers'}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Driver
                </button>
              </div>
            ) : (
              <>
                <select 
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 mb-4"
                  value={selectedDriver}
                  onChange={(e) => setSelectedDriver(e.target.value)}
                >
                  <option value="">Select a driver</option>
                  {drivers.map(driver => (
                    <option key={driver._id} value={driver._id}>
                      {driver.name} - {driver.experience} yrs exp
                    </option>
                  ))}
                </select>
                <div className="flex gap-3">
                  <button 
                    onClick={handleAssignDriver}
                    className="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700"
                  >
                    Assign & Approve
                  </button>
                  <button 
                    onClick={() => { setDriverModal(null); setSelectedDriver(''); }}
                    className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
