import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { Search, Loader2, Eye, CheckCircle, XCircle, DollarSign, X } from "lucide-react";
import API from "../../services/api";
import { toast } from "react-toastify";

export default function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/admin/bookings');
      setBookings(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const { data } = await API.put(`/admin/bookings/${id}/status`, { status });
      setBookings(bookings.map(b => b._id === id ? data : b));
      toast.success(`Booking ${status} successfully`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  const handleRefund = async (id) => {
    if (!window.confirm('Are you sure you want to refund this booking?')) return;
    try {
      await API.post(`/admin/bookings/${id}/refund`);
      fetchBookings();
      toast.success('Booking refunded successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to refund');
    }
  };

  const viewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      ongoing: 'bg-blue-100 text-blue-700',
      completed: 'bg-purple-100 text-purple-700',
      cancelled: 'bg-red-100 text-red-700',
      rejected: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getTimelineSteps = (booking) => {
    const steps = [
      { label: 'Created', status: 'completed', date: booking.createdAt },
      { label: 'Approved', status: booking.status === 'pending' ? 'pending' : 'completed', date: booking.createdAt },
      { label: 'Ongoing', status: ['ongoing', 'completed'].includes(booking.status) ? 'completed' : 'pending' },
      { label: 'Completed', status: booking.status === 'completed' ? 'completed' : 'pending' }
    ];
    if (booking.status === 'cancelled' || booking.status === 'rejected') {
      return [{ label: 'Created', status: 'completed', date: booking.createdAt }, { label: 'Cancelled', status: 'cancelled' }];
    }
    return steps;
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.vehicle?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.user?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || b.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      
      <div className="md:ml-56 flex-1 bg-gray-100 min-h-screen p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 mt-12 md:mt-0">All Bookings</h1>
        
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex items-center border rounded-lg px-3 py-2">
              <Search size={20} className="text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search bookings..." 
                className="w-full outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['all', 'pending', 'approved', 'ongoing', 'completed', 'cancelled'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                    filterStatus === status
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading && <div className="flex justify-center py-20"><Loader2 size={48} className="animate-spin text-purple-600" /></div>}
        {error && <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg">{error}</div>}

        {!loading && !error && (
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-semibold">Vehicle</th>
                  <th className="text-left p-4 font-semibold">Customer</th>
                  <th className="text-left p-4 font-semibold">Owner</th>
                  <th className="text-left p-4 font-semibold">Date</th>
                  <th className="text-left p-4 font-semibold">Amount</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{booking.vehicle?.name || 'N/A'}</td>
                    <td className="p-4">{booking.user?.name || 'N/A'}</td>
                    <td className="p-4">{booking.owner?.name || 'N/A'}</td>
                    <td className="p-4 text-sm">
                      <div>{formatDate(booking.startDate)}</div>
                      <div className="text-gray-500">to {formatDate(booking.endDate)}</div>
                    </td>
                    <td className="p-4 font-bold text-purple-600">₹{booking.totalAmount}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => viewDetails(booking)} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition" title="View Details">
                          <Eye size={16} />
                        </button>
                        {['approved', 'pending'].includes(booking.status) && (
                          <button onClick={() => handleRefund(booking._id)} className="p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition" title="Refund">
                            <DollarSign size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Booking Details</h2>
                  <p className="text-purple-100 mt-1">ID: {selectedBooking._id}</p>
                </div>
                <button onClick={() => setShowModal(false)} className="text-white hover:bg-white/20 p-2 rounded-lg transition">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Vehicle Information</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-500">Name:</span> <span className="font-medium">{selectedBooking.vehicle?.name}</span></div>
                      <div><span className="text-gray-500">Location:</span> <span className="font-medium">{selectedBooking.location}</span></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Customer Information</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-500">Name:</span> <span className="font-medium">{selectedBooking.user?.name}</span></div>
                      <div><span className="text-gray-500">Owner:</span> <span className="font-medium">{selectedBooking.owner?.name}</span></div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6 mb-6">
                  <h3 className="font-semibold text-lg mb-3">Booking Details</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div><span className="text-gray-500">Start Date:</span> <span className="font-medium">{formatDate(selectedBooking.startDate)}</span></div>
                    <div><span className="text-gray-500">End Date:</span> <span className="font-medium">{formatDate(selectedBooking.endDate)}</span></div>
                    <div><span className="text-gray-500">Total Amount:</span> <span className="font-semibold text-purple-600">₹{selectedBooking.totalAmount}</span></div>
                    <div><span className="text-gray-500">Payment Method:</span> <span className="font-medium capitalize">{selectedBooking.paymentMethod}</span></div>
                    <div><span className="text-gray-500">Payment Status:</span> <span className="font-medium capitalize">{selectedBooking.paymentStatus}</span></div>
                    <div><span className="text-gray-500">Need Driver:</span> <span className="font-medium">{selectedBooking.needDriver ? 'Yes' : 'No'}</span></div>
                    {selectedBooking.needDriver && <div><span className="text-gray-500">Driver Charges:</span> <span className="font-medium">₹{selectedBooking.driverCharges}</span></div>}
                    {selectedBooking.latePenalty > 0 && <div><span className="text-gray-500">Late Penalty:</span> <span className="font-medium text-red-600">₹{selectedBooking.latePenalty}</span></div>}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-lg mb-4">Booking Timeline</h3>
                  <div className="relative">
                    {getTimelineSteps(selectedBooking).map((step, idx) => (
                      <div key={idx} className="flex items-start mb-6 last:mb-0">
                        <div className="relative">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            step.status === 'completed' ? 'bg-green-500' :
                            step.status === 'cancelled' ? 'bg-red-500' :
                            'bg-gray-300'
                          }`}>
                            {step.status === 'completed' ? <CheckCircle size={20} className="text-white" /> : <div className="w-3 h-3 bg-white rounded-full"></div>}
                          </div>
                          {idx < getTimelineSteps(selectedBooking).length - 1 && (
                            <div className={`absolute left-5 top-10 w-0.5 h-6 ${
                              step.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                            }`}></div>
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="font-semibold">{step.label}</div>
                          {step.date && <div className="text-xs text-gray-500 mt-1">{new Date(step.date).toLocaleString()}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
