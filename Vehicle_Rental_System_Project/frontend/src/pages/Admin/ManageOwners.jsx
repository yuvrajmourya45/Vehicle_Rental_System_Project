import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { Search, Loader2, Ban, CheckCircle, Car, DollarSign, User, Mail, Phone } from "lucide-react";
import API from "../../services/api";
import { toast } from 'react-toastify';

export default function ManageOwners() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      const { data } = await API.get('/admin/owners');
      setOwners(data);
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
      </div>
    </div>
  );
}