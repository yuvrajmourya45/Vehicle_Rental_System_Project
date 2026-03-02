import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { Search, Ban, CheckCircle, Loader2, Eye, Trash2, X } from "lucide-react";
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
    <div className="flex"><AdminSidebar /><div className="md:ml-56 flex-1 flex items-center justify-center h-screen"><Loader2 size={48} className="animate-spin text-purple-600" /></div></div>
  );

  return (
    <div className="flex">
      <AdminSidebar />
      
      <div className="md:ml-56 flex-1 bg-gray-100 min-h-screen p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 mt-12 md:mt-0">Manage Users</h1>
        
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Search size={20} className="text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="w-full outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="text-left p-4 font-semibold">Name</th>
                <th className="text-left p-4 font-semibold">Email</th>
                <th className="text-left p-4 font-semibold">Phone</th>
                <th className="text-left p-4 font-semibold">KYC Status</th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-left p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{user.email}</td>
                  <td className="p-4 text-gray-600">{user.phone || 'N/A'}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.kycStatus === 'verified' ? 'bg-green-100 text-green-700' :
                      user.kycStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {user.kycStatus || 'pending'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => viewBookingHistory(user)} 
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        title="View Bookings"
                      >
                        <Eye size={16} />
                      </button>
                      {user.status === "active" ? (
                        <button 
                          onClick={() => handleStatus(user._id, 'blocked')} 
                          className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                          title="Block User"
                        >
                          <Ban size={16} />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleStatus(user._id, 'active')} 
                          className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                          title="Unblock User"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(user._id)} 
                        className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Booking History</h2>
                  <p className="text-purple-100 mt-1">{selectedUser?.name}</p>
                </div>
                <button onClick={() => setShowModal(false)} className="text-white hover:bg-white/20 p-2 rounded-lg transition">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {bookings.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No bookings found</p>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking._id} className="border rounded-lg p-4 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{booking.vehicle?.name}</h3>
                            <p className="text-sm text-gray-600">{booking.vehicle?.brand} {booking.vehicle?.model}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'approved' ? 'bg-green-100 text-green-700' :
                            booking.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Start Date</p>
                            <p className="font-medium">{new Date(booking.startDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">End Date</p>
                            <p className="font-medium">{new Date(booking.endDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Total Amount</p>
                            <p className="font-semibold text-purple-600">₹{booking.totalAmount}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Payment Status</p>
                            <p className="font-medium capitalize">{booking.paymentStatus}</p>
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
