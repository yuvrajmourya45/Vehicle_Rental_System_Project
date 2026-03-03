import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { Search, Loader2, Eye, Ban, CheckCircle, Car, DollarSign, FileText, User, Mail, Phone, X } from "lucide-react";
import API from "../../services/api";
import { toast } from 'react-toastify';

export default function ManageOwners() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [showVehicles, setShowVehicles] = useState(false);
  const [ownerVehicles, setOwnerVehicles] = useState([]);
  const [showEarnings, setShowEarnings] = useState(false);
  const [ownerBookings, setOwnerBookings] = useState([]);

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      const { data } = await API.get('/admin/owners');
      
      const ownersWithStats = await Promise.all(
        data.map(async (owner) => {
          try {
            const vehiclesRes = await API.get('/vehicles');
            const ownerVehicles = vehiclesRes.data.filter(v => v.owner?._id === owner._id);
            const bookingsRes = await API.get('/admin/bookings');
            const ownerBookings = bookingsRes.data.filter(b => b.owner?._id === owner._id && (b.status === 'approved' || b.status === 'completed'));
            
            return {
              ...owner,
              vehicleCount: ownerVehicles.length,
              earnings: ownerBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)
            };
          } catch {
            return { ...owner, vehicleCount: 0, earnings: 0 };
          }
        })
      );
      
      setOwners(ownersWithStats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id, status) => {
    try {
      await API.put(`/admin/owners/${id}/status`, { status });
      setOwners(owners.map(o => o._id === id ? {...o, status} : o));
      toast.success(`Owner ${status === 'active' ? 'activated' : 'suspended'} successfully!`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const viewVehicles = async (owner) => {
    setSelectedOwner(owner);
    setShowVehicles(true);
    try {
      const { data } = await API.get('/vehicles');
      const filtered = data.filter(v => v.owner?._id === owner._id);
      setOwnerVehicles(filtered);
    } catch (err) {
      toast.error('Failed to load vehicles');
    }
  };

  const viewEarnings = async (owner) => {
    setSelectedOwner(owner);
    setShowEarnings(true);
    try {
      const { data } = await API.get('/admin/bookings');
      const filtered = data.filter(b => b.owner?._id === owner._id);
      setOwnerBookings(filtered);
    } catch (err) {
      toast.error('Failed to load earnings');
    }
  };

  const filteredOwners = owners.filter(o => 
    o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="flex bg-gray-50">
      <AdminSidebar />
      <div className="md:ml-56 flex-1 flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading owners...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />
      
      <div className="md:ml-56 flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mb-6 sm:mb-8 mt-16 md:mt-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">Manage Owners</h1>
          <p className="text-sm sm:text-base text-gray-600">View and manage vehicle owners</p>
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
                  <th className="text-left p-4 font-semibold text-gray-700">Owner</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Contact</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Vehicles</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Revenue</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOwners.map((owner) => (
                  <tr key={owner._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-100 w-10 h-10 rounded-full flex items-center justify-center">
                          <span className="font-bold text-purple-600 text-sm">{owner.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{owner.name}</p>
                          <p className="text-sm text-gray-500">{owner.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{owner.phone || 'Not provided'}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Car size={16} className="text-blue-600" />
                        <span className="font-bold text-gray-800">{owner.vehicleCount}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-green-600" />
                        <span className="font-bold text-green-600">₹{owner.earnings}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        owner.status === "active" 
                          ? "bg-green-100 text-green-700 border-green-200" 
                          : "bg-red-100 text-red-700 border-red-200"
                      }`}>
                        {owner.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => viewVehicles(owner)} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition" title="View Vehicles">
                          <Car size={16} />
                        </button>
                        <button onClick={() => viewEarnings(owner)} className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition" title="View Earnings">
                          <DollarSign size={16} />
                        </button>
                        {owner.status === "active" ? (
                          <button onClick={() => handleStatus(owner._id, 'blocked')} className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition" title="Suspend">
                            <Ban size={16} />
                          </button>
                        ) : (
                          <button onClick={() => handleStatus(owner._id, 'active')} className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition" title="Activate">
                            <CheckCircle size={16} />
                          </button>
                        )}
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
          {filteredOwners.map((owner) => (
            <div key={owner._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold flex-shrink-0">
                  {owner.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 text-base sm:text-lg truncate">{owner.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                    <Mail size={14} />
                    <span className="truncate">{owner.email}</span>
                  </div>
                  {owner.phone && (
                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                      <Phone size={14} />
                      <span>{owner.phone}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Car size={16} className="text-blue-600" />
                    <span className="text-xs text-blue-600 font-medium">VEHICLES</span>
                  </div>
                  <p className="text-lg font-bold text-blue-700">{owner.vehicleCount}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <DollarSign size={16} className="text-green-600" />
                    <span className="text-xs text-green-600 font-medium">REVENUE</span>
                  </div>
                  <p className="text-lg font-bold text-green-700">₹{owner.earnings}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${
                  owner.status === "active" 
                    ? "bg-green-100 text-green-700 border-green-200" 
                    : "bg-red-100 text-red-700 border-red-200"
                }`}>
                  {owner.status.toUpperCase()}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button onClick={() => viewVehicles(owner)} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                  <Car size={16} />
                  <span className="hidden sm:inline">Vehicles</span>
                </button>
                <button onClick={() => viewEarnings(owner)} className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium">
                  <DollarSign size={16} />
                  <span className="hidden sm:inline">Earnings</span>
                </button>
                {owner.status === "active" ? (
                  <button onClick={() => handleStatus(owner._id, 'blocked')} className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium">
                    <Ban size={16} />
                    <span className="hidden sm:inline">Suspend</span>
                  </button>
                ) : (
                  <button onClick={() => handleStatus(owner._id, 'active')} className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium">
                    <CheckCircle size={16} />
                    <span className="hidden sm:inline">Activate</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredOwners.length === 0 && !loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
            <User size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No owners found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}

      {/* Vehicles Modal */}
      {showVehicles && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold">Owner Vehicles</h3>
                  <p className="text-blue-100">{selectedOwner?.name}</p>
                </div>
                <button 
                  onClick={() => setShowVehicles(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {ownerVehicles.length === 0 ? (
                <div className="text-center py-12">
                  <Car size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No vehicles found</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {ownerVehicles.map((vehicle) => (
                    <div key={vehicle._id} className="border-2 rounded-xl p-4 hover:border-blue-300 transition">
                      <div className="flex items-center gap-3 mb-2">
                        <Car className="text-blue-600" size={24} />
                        <div>
                          <p className="font-bold">{vehicle.name}</p>
                          <p className="text-sm text-gray-600">{vehicle.category}</p>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-bold text-green-600">${vehicle.price}/day</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          vehicle.status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {vehicle.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Earnings Modal */}
      {showEarnings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold">Earnings Report</h3>
                  <p className="text-green-100">{selectedOwner?.name}</p>
                </div>
                <button 
                  onClick={() => setShowEarnings(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="bg-green-50 rounded-xl p-6 mb-6">
                <p className="text-sm text-green-600 mb-2">Total Earnings</p>
                <p className="text-4xl font-bold text-green-700">${selectedOwner?.earnings}</p>
              </div>

              {ownerBookings.length === 0 ? (
                <div className="text-center py-12">
                  <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No bookings found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {ownerBookings.map((booking) => (
                    <div key={booking._id} className="border-2 rounded-xl p-4 hover:border-green-300 transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold">{booking.vehicle?.name}</p>
                          <p className="text-sm text-gray-600">User: {booking.user?.name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">${booking.totalAmount}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            booking.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {booking.status}
                          </span>
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
  );
}