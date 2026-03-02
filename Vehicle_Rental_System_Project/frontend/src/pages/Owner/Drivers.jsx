import React, { useState, useEffect } from "react";
import OwnerSidebar from "../../components/OwnerSidebar";
import { Plus, Edit2, Trash2, Loader2, User, Phone, CreditCard, Award, X } from "lucide-react";
import API from "../../services/api";
import { toast } from 'react-toastify';

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    licenseNumber: "",
    experience: ""
  });

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const { data } = await API.get('/drivers');
      setDrivers(data);
    } catch (err) {
      toast.error('Failed to load drivers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDriver) {
        await API.put(`/drivers/${editingDriver._id}`, formData);
        toast.success('Driver updated!');
      } else {
        await API.post('/drivers', formData);
        toast.success('Driver added!');
      }
      setShowModal(false);
      setEditingDriver(null);
      setFormData({ name: "", phone: "", licenseNumber: "", experience: "" });
      fetchDrivers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save driver');
    }
  };

  const handleEdit = (driver) => {
    setEditingDriver(driver);
    setFormData({
      name: driver.name,
      phone: driver.phone,
      licenseNumber: driver.licenseNumber,
      experience: driver.experience
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this driver?')) return;
    try {
      await API.delete(`/drivers/${id}`);
      toast.success('Driver deleted!');
      fetchDrivers();
    } catch (err) {
      toast.error('Failed to delete driver');
    }
  };

  if (loading) return (
    <div className="flex"><OwnerSidebar /><div className="md:ml-56 flex-1 flex items-center justify-center h-screen"><Loader2 size={48} className="animate-spin text-blue-600" /></div></div>
  );

  return (
    <div className="flex">
      <OwnerSidebar />
      
      <div className="md:ml-56 flex-1 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen p-4 md:p-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Drivers</h1>
              <p className="text-blue-100">Manage your professional drivers</p>
            </div>
            <button 
              onClick={() => { setShowModal(true); setEditingDriver(null); setFormData({ name: "", phone: "", licenseNumber: "", experience: "" }); }}
              className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-lg transition transform hover:scale-105"
            >
              <Plus size={20} />
              Add Driver
            </button>
          </div>
        </div>

        {drivers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
            <div className="bg-blue-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
              <User size={64} className="text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No drivers yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">Start building your team by adding professional drivers to handle bookings that require driver services</p>
            <button 
              onClick={() => setShowModal(true)}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition transform hover:scale-105"
            >
              Add Your First Driver
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drivers.map((driver) => (
              <div key={driver._id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 overflow-hidden">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white relative">
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      onClick={() => handleEdit(driver)} 
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(driver._id)} 
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-red-500 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm w-20 h-20 rounded-full flex items-center justify-center mb-4">
                    <User size={40} />
                  </div>
                  <h3 className="text-2xl font-bold">{driver.name}</h3>
                  <div className={`mt-3 inline-block px-4 py-1 rounded-full text-sm font-bold ${
                    driver.isAvailable ? 'bg-green-400 text-green-900' : 'bg-gray-400 text-gray-900'
                  }`}>
                    {driver.isAvailable ? '✓ Available' : '⊗ Busy'}
                  </div>
                </div>
                
                {/* Card Body */}
                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Phone size={20} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                      <p className="font-semibold text-gray-800">{driver.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <CreditCard size={20} className="text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">License Number</p>
                      <p className="font-semibold text-gray-800">{driver.licenseNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Award size={20} className="text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Experience</p>
                      <p className="font-semibold text-gray-800">{driver.experience} Years</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full transform transition-all animate-slideUp">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-3xl text-white">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">{editingDriver ? 'Edit Driver' : 'Add New Driver'}</h3>
                <button 
                  onClick={() => { setShowModal(false); setEditingDriver(null); }}
                  className="p-2 hover:bg-white/20 rounded-lg transition"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <div className="flex items-center border-2 border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-500 transition">
                  <User size={20} className="text-gray-400 mr-3" />
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <div className="flex items-center border-2 border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-500 transition">
                  <Phone size={20} className="text-gray-400 mr-3" />
                  <input 
                    type="tel" 
                    className="outline-none w-full"
                    placeholder="+1 234 567 8900"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">License Number</label>
                <div className="flex items-center border-2 border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-500 transition">
                  <CreditCard size={20} className="text-gray-400 mr-3" />
                  <input 
                    type="text" 
                    className="outline-none w-full"
                    placeholder="DL-1234567890"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Experience (Years)</label>
                <div className="flex items-center border-2 border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-500 transition">
                  <Award size={20} className="text-gray-400 mr-3" />
                  <input 
                    type="number" 
                    className="outline-none w-full"
                    placeholder="5"
                    min="0"
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition transform hover:scale-105"
                >
                  {editingDriver ? 'Update Driver' : 'Add Driver'}
                </button>
                <button 
                  type="button" 
                  onClick={() => { setShowModal(false); setEditingDriver(null); }} 
                  className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
