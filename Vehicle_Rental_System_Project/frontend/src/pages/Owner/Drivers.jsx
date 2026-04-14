import React, { useState, useEffect } from "react";
import OwnerSidebar from "../../components/OwnerSidebar";
import { Plus, Edit2, Trash2, Loader2, User, Phone, CreditCard, Award, X, Camera, Upload } from "lucide-react";
import API from "../../services/api";
import { toast } from 'react-toastify';

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", licenseNumber: "", experience: "" });

  useEffect(() => { fetchDrivers(); }, []);

  const fetchDrivers = async () => {
    try {
      const { data } = await API.get('/drivers');
      setDrivers(data);
    } catch (err) {
      toast.error('Failed to load drivers');
    } finally { setLoading(false); }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.keys(formData).forEach(k => fd.append(k, formData[k]));
      if (photoFile) fd.append('photo', photoFile);

      if (editingDriver) {
        await API.put(`/drivers/${editingDriver._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Driver updated!');
      } else {
        await API.post('/drivers', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Driver added!');
      }
      closeModal();
      fetchDrivers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save driver');
    } finally { setSubmitting(false); }
  };

  const handleEdit = (driver) => {
    setEditingDriver(driver);
    setFormData({ name: driver.name, phone: driver.phone, licenseNumber: driver.licenseNumber, experience: driver.experience });
    setPhotoPreview(driver.photo || '');
    setPhotoFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this driver?')) return;
    try {
      await API.delete(`/drivers/${id}`);
      toast.success('Driver deleted!');
      setDrivers(drivers.filter(d => d._id !== id));
    } catch (err) {
      toast.error('Failed to delete driver');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDriver(null);
    setPhotoFile(null);
    setPhotoPreview('');
    setFormData({ name: "", phone: "", licenseNumber: "", experience: "" });
  };

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  if (loading) return (
    <div className="flex"><OwnerSidebar /><div className="md:ml-56 flex-1 flex items-center justify-center h-screen"><Loader2 size={48} className="animate-spin text-purple-600" /></div></div>
  );

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <OwnerSidebar />
      <div className="md:ml-56 flex-1 p-4 md:p-8">

        {/* Header */}
        <div className="mb-8 mt-16 md:mt-0">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-blue-200 font-medium mb-1">Owner Panel</p>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">My Drivers 🚗</h1>
                <p className="text-blue-100">{drivers.length} driver{drivers.length !== 1 ? 's' : ''} in your team</p>
              </div>
              <button onClick={() => { setShowModal(true); setEditingDriver(null); }}
                className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-xl font-bold hover:bg-purple-50 transition shadow-lg self-start sm:self-auto">
                <Plus size={20} /> Add Driver
              </button>
            </div>
          </div>
        </div>

        {drivers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <User size={48} className="text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No drivers yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">Add professional drivers to handle bookings that require driver services</p>
            <button onClick={() => setShowModal(true)} className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition">
              Add Your First Driver
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {drivers.map((driver) => (
              <div key={driver._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition hover:-translate-y-1 group">
                {/* Card Top */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white relative">
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => handleEdit(driver)} className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition"><Edit2 size={15} /></button>
                    <button onClick={() => handleDelete(driver._id)} className="p-2 bg-white/20 rounded-lg hover:bg-red-500 transition"><Trash2 size={15} /></button>
                  </div>

                  {/* Driver Photo */}
                  <div className="flex items-center gap-4">
                    {driver.photo ? (
                      <img src={driver.photo} alt={driver.name} className="w-20 h-20 rounded-full object-cover border-4 border-white/30 shadow-lg" />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center text-2xl font-bold shadow-lg">
                        {getInitials(driver.name)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold">{driver.name}</h3>
                      <span className={`mt-1 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${driver.isAvailable ? 'bg-green-400/30 text-green-100' : 'bg-gray-400/30 text-gray-100'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${driver.isAvailable ? 'bg-green-300' : 'bg-gray-300'}`}></span>
                        {driver.isAvailable ? 'Available' : 'Busy'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                    <div className="bg-blue-100 p-2 rounded-lg"><Phone size={16} className="text-blue-600" /></div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">Phone</p>
                      <p className="font-semibold text-gray-800 text-sm">{driver.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                    <div className="bg-purple-100 p-2 rounded-lg"><CreditCard size={16} className="text-purple-600" /></div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">License</p>
                      <p className="font-semibold text-gray-800 text-sm">{driver.licenseNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                    <div className="bg-green-100 p-2 rounded-lg"><Award size={16} className="text-green-600" /></div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">Experience</p>
                      <p className="font-semibold text-gray-800 text-sm">{driver.experience} Years</p>
                    </div>
                  </div>
                </div>

                {/* Edit/Delete always visible on mobile */}
                <div className="px-5 pb-5 flex gap-2 sm:hidden">
                  <button onClick={() => handleEdit(driver)} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-100 transition">
                    <Edit2 size={15} /> Edit
                  </button>
                  <button onClick={() => handleDelete(driver._id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition">
                    <Trash2 size={15} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">{editingDriver ? 'Edit Driver' : 'Add New Driver'}</h3>
              <button onClick={closeModal} className="p-2 hover:bg-white/20 rounded-lg transition"><X size={22} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Photo Upload */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-24 h-24 rounded-full object-cover border-4 border-purple-200 shadow-md" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 border-4 border-purple-200 flex items-center justify-center shadow-md">
                      <User size={36} className="text-purple-400" />
                    </div>
                  )}
                  <label htmlFor="driver-photo" className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full cursor-pointer hover:bg-purple-700 transition shadow-lg">
                    <Camera size={14} />
                  </label>
                  <input id="driver-photo" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                </div>
                <p className="text-xs text-gray-400">Click camera icon to upload photo</p>
              </div>

              {[
                { label: 'Full Name', key: 'name', type: 'text', placeholder: 'John Doe', icon: User },
                { label: 'Phone Number', key: 'phone', type: 'tel', placeholder: '+91 9876543210', icon: Phone },
                { label: 'License Number', key: 'licenseNumber', type: 'text', placeholder: 'DL-1234567890', icon: CreditCard },
                { label: 'Experience (Years)', key: 'experience', type: 'number', placeholder: '5', icon: Award },
              ].map(({ label, key, type, placeholder, icon: Icon }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                  <div className="flex items-center border-2 border-gray-200 rounded-xl px-4 py-3 focus-within:border-purple-500 transition">
                    <Icon size={18} className="text-gray-400 mr-3 flex-shrink-0" />
                    <input type={type} className="outline-none w-full text-sm" placeholder={placeholder}
                      value={formData[key]} onChange={(e) => setFormData({ ...formData, [key]: e.target.value })} required min={type === 'number' ? 0 : undefined} />
                  </div>
                </div>
              ))}

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={submitting}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2">
                  {submitting && <Loader2 size={18} className="animate-spin" />}
                  {editingDriver ? 'Update Driver' : 'Add Driver'}
                </button>
                <button type="button" onClick={closeModal} className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition text-gray-600">
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
