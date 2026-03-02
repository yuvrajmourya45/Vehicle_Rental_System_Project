import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { Search, Ban, CheckCircle, Loader2, Eye, Trash2, X, User, Mail, Phone } from "lucide-react";
import API from "../../services/api";
import { toast } from "react-toastify";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/admin/users');
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id, status) => {
    try {
      await API.put(`/admin/users/${id}/status`, { status });
      setUsers(users.map(u => u._id === id ? {...u, status} : u));
      toast.success(`User ${status === 'active' ? 'unblocked' : 'blocked'} successfully`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
      toast.success('User deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const viewBookingHistory = async (user) => {
    try {
      setSelectedUser(user);
      const { data } = await API.get(`/admin/users/${user._id}/bookings`);
      setBookings(data);
      setShowModal(true);
    } catch (err) {
      toast.error('Failed to fetch booking history');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="flex bg-gray-50">
      <AdminSidebar />
      <div className="md:ml-56 flex-1 flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />
      
      <div className="md:ml-56 flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mb-6 sm:mb-8 mt-16 md:mt-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">Manage Users</h1>
          <p className="text-sm sm:text-base text-gray-600">View and manage all registered users</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex items-center border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 focus-within:border-purple-500 transition">
            <Search size={18} className="text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-full outline-none text-sm sm:text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700">User</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Contact</th>
                  <th className="text-left p-4 font-semibold text-gray-700">KYC</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{user.phone || 'Not provided'}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        user.kycStatus === 'verified' ? 'bg-green-100 text-green-700 border-green-200' :
                        user.kycStatus === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                        'bg-yellow-100 text-yellow-700 border-yellow-200'
                      }`}>
                        {user.kycStatus || 'pending'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        user.status === "active" ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => viewBookingHistory(user)} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition" title="View Bookings">
                          <Eye size={16} />
                        </button>
                        {user.status === "active" ? (
                          <button onClick={() => handleStatus(user._id, 'blocked')} className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition" title="Block">
                            <Ban size={16} />
                          </button>
                        ) : (
                          <button onClick={() => handleStatus(user._id, 'active')} className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition" title="Unblock">
                            <CheckCircle size={16} />
                          </button>
                        )}
                        <button onClick={() => handleDelete(user._id)} className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {filteredUsers.map((user) => (
            <div key={user._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold flex-shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 text-base sm:text-lg truncate">{user.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                    <Mail size={14} />
                    <span className="truncate">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                      <Phone size={14} />
                      <span>{user.phone}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${
                  user.kycStatus === 'verified' ? 'bg-green-100 text-green-700 border-green-200' :
                  user.kycStatus === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                  'bg-yellow-100 text-yellow-700 border-yellow-200'
                }`}>
                  KYC: {user.kycStatus || 'pending'}
                </span>
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${
                  user.status === "active" ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"
                }`}>
                  {user.status}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button onClick={() => viewBookingHistory(user)} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                  <Eye size={16} />
                  <span className="hidden sm:inline">Bookings</span>
                </button>
                {user.status === "active" ? (
                  <button onClick={() => handleStatus(user._id, 'blocked')} className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium">
                    <Ban size={16} />
                    <span className="hidden sm:inline">Block</span>
                  </button>
                ) : (
                  <button onClick={() => handleStatus(user._id, 'active')} className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium">
                    <CheckCircle size={16} />
                    <span className="hidden sm:inline">Unblock</span>
                  </button>
                )}
                <button onClick={() => handleDelete(user._id)} className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm font-medium">
                  <Trash2 size={16} />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && !loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
            <User size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No users found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 sm:p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Booking History</h2>
                  <p className="text-purple-100 mt-1 text-sm sm:text-base">{selectedUser?.name}</p>
                </div>
                <button onClick={() => setShowModal(false)} className="text-white hover:bg-white/20 p-2 rounded-lg transition">
                  <X size={20} className="sm:w-6 sm:h-6" />
                </button>
              </div>
              
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {bookings.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="text-4xl sm:text-6xl mb-4">📋</div>
                    <p className="text-gray-500 text-sm sm:text-base">No bookings found for this user</p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking._id} className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-base sm:text-lg text-gray-800">{booking.vehicle?.name}</h3>
                            <p className="text-xs sm:text-sm text-gray-600">{booking.vehicle?.brand} {booking.vehicle?.model}</p>
                          </div>
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border self-start ${
                            booking.status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' :
                            booking.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                            'bg-yellow-100 text-yellow-700 border-yellow-200'
                          }`}>
                            {booking.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs sm:text-sm">
                          <div>
                            <p className="text-gray-500 font-medium">Start Date</p>
                            <p className="font-medium text-gray-800">{new Date(booking.startDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 font-medium">End Date</p>
                            <p className="font-medium text-gray-800">{new Date(booking.endDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 font-medium">Total Amount</p>
                            <p className="font-semibold text-purple-600">₹{booking.totalAmount}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 font-medium">Payment Status</p>
                            <p className="font-medium capitalize text-gray-800">{booking.paymentStatus}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
