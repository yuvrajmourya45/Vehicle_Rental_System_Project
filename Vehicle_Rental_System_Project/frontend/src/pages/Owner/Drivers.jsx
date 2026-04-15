import React, { useState, useEffect } from "react";
import OwnerSidebar from "../../components/OwnerSidebar";
import { Plus, Edit2, Trash2, Loader2, User, Phone, CreditCard, Award, X, Camera, Search, CheckCircle, XCircle } from "lucide-react";
import API from "../../services/api";
import { toast } from "react-toastify";

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({ name: "", phone: "", licenseNumber: "", experience: "" });

  useEffect(() => { fetchDrivers(); }, []);

  const fetchDrivers = async () => {
    try {
      const { data } = await API.get("/drivers");
      setDrivers(data);
    } catch { toast.error("Failed to load drivers"); }
    finally { setLoading(false); }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) { setPhotoFile(file); setPhotoPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.keys(formData).forEach(k => fd.append(k, formData[k]));
      if (photoFile) fd.append("photo", photoFile);
      if (editingDriver) {
        await API.put(`/drivers/${editingDriver._id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Driver updated!");
      } else {
        await API.post("/drivers", fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Driver added!");
      }
      closeModal();
      fetchDrivers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save driver");
    } finally { setSubmitting(false); }
  };

  const handleEdit = (driver) => {
    setEditingDriver(driver);
    setFormData({ name: driver.name, phone: driver.phone, licenseNumber: driver.licenseNumber, experience: driver.experience });
    setPhotoPreview(driver.photo || "");
    setPhotoFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this driver?")) return;
    try {
      await API.delete(`/drivers/${id}`);
      toast.success("Driver deleted!");
      setDrivers(drivers.filter(d => d._id !== id));
    } catch { toast.error("Failed to delete driver"); }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDriver(null);
    setPhotoFile(null);
    setPhotoPreview("");
    setFormData({ name: "", phone: "", licenseNumber: "", experience: "" });
  };

  const getInitials = (name) => name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "D";

  const filtered = drivers.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.phone?.includes(search) ||
    d.licenseNumber?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex">
      <OwnerSidebar />
      <div className="md:ml-56 flex-1 flex items-center justify-center h-screen bg-gray-50">
        <Loader2 size={36} className="animate-spin text-green-600" />
      </div>
    </div>
  );

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <OwnerSidebar />

      <div className="md:ml-56 flex-1 p-6 mt-14 md:mt-0">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 border-l-4 border-green-500 pl-3">My Drivers</h1>
            <p className="text-gray-400 text-sm mt-1 pl-4">{drivers.length} driver{drivers.length !== 1 ? "s" : ""} in your fleet</p>
          </div>
          <button
            onClick={() => { setShowModal(true); setEditingDriver(null); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition shadow-sm"
          >
            <Plus size={16} /> Add Driver
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 mb-6 w-full sm:w-72 shadow-sm">
          <Search size={15} className="text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search drivers..."
            className="text-sm outline-none w-full text-gray-600 placeholder-gray-400"
          />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{drivers.length}</p>
            <p className="text-xs text-gray-400 mt-1">Total Drivers</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{drivers.filter(d => d.isAvailable).length}</p>
            <p className="text-xs text-gray-400 mt-1">Available</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-orange-500">{drivers.filter(d => !d.isAvailable).length}</p>
            <p className="text-xs text-gray-400 mt-1">On Duty</p>
          </div>
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={32} className="text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium mb-1">No drivers found</p>
            <p className="text-gray-400 text-sm mb-4">Add drivers to manage your fleet</p>
            <button onClick={() => setShowModal(true)} className="px-5 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition">
              Add First Driver
            </button>
          </div>
        )}

        {/* Driver Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((driver) => (
            <div key={driver._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition group">

              {/* Card Top */}
              <div className="relative p-5 pb-4 border-b border-gray-50">
                <div className="flex items-center gap-4">
                  {driver.photo ? (
                    <img src={driver.photo} alt={driver.name} className="w-14 h-14 rounded-full object-cover border-2 border-gray-100" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg border-2 border-green-200">
                      {getInitials(driver.name)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{driver.name}</h3>
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${
                      driver.isAvailable ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-600"
                    }`}>
                      {driver.isAvailable
                        ? <><CheckCircle size={10} /> Available</>
                        : <><XCircle size={10} /> On Duty</>
                      }
                    </span>
                  </div>
                </div>

                {/* Hover Actions */}
                <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => handleEdit(driver)} className="p-1.5 bg-gray-100 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition">
                    <Edit2 size={13} />
                  </button>
                  <button onClick={() => handleDelete(driver._id)} className="p-1.5 bg-gray-100 hover:bg-red-100 hover:text-red-600 rounded-lg transition">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-2.5">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone size={14} className="text-blue-600" />
                  </div>
                  <span className="text-gray-700 font-medium">{driver.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard size={14} className="text-purple-600" />
                  </div>
                  <span className="text-gray-700 font-medium">{driver.licenseNumber}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award size={14} className="text-green-600" />
                  </div>
                  <span className="text-gray-700 font-medium">{driver.experience} yrs experience</span>
                </div>
              </div>

              {/* Mobile Actions */}
              <div className="px-5 pb-4 flex gap-2 sm:hidden">
                <button onClick={() => handleEdit(driver)} className="flex-1 py-2 bg-gray-50 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-100 transition flex items-center justify-center gap-1">
                  <Edit2 size={12} /> Edit
                </button>
                <button onClick={() => handleDelete(driver._id)} className="flex-1 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-semibold hover:bg-red-100 transition flex items-center justify-center gap-1">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">{editingDriver ? "Edit Driver" : "Add New Driver"}</h3>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Photo Upload */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-20 h-20 rounded-full object-cover border-2 border-green-200" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
                      <User size={30} className="text-green-400" />
                    </div>
                  )}
                  <label htmlFor="driver-photo" className="absolute bottom-0 right-0 bg-green-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-green-700 transition">
                    <Camera size={12} />
                  </label>
                  <input id="driver-photo" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                </div>
                <p className="text-xs text-gray-400">Upload driver photo</p>
              </div>

              {[
                { label: "Full Name", key: "name", type: "text", placeholder: "John Doe", icon: User },
                { label: "Phone Number", key: "phone", type: "tel", placeholder: "+91 9876543210", icon: Phone },
                { label: "License Number", key: "licenseNumber", type: "text", placeholder: "DL-1234567890", icon: CreditCard },
                { label: "Experience (Years)", key: "experience", type: "number", placeholder: "5", icon: Award },
              ].map(({ label, key, type, placeholder, icon: Icon }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                  <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 transition">
                    <Icon size={16} className="text-gray-400 mr-2.5 flex-shrink-0" />
                    <input
                      type={type}
                      className="outline-none w-full text-sm text-gray-700"
                      placeholder={placeholder}
                      value={formData[key]}
                      onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                      required
                      min={type === "number" ? 0 : undefined}
                    />
                  </div>
                </div>
              ))}

              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 size={15} className="animate-spin" />}
                  {editingDriver ? "Update Driver" : "Add Driver"}
                </button>
                <button type="button" onClick={closeModal} className="flex-1 py-2.5 border border-gray-200 rounded-xl font-semibold text-sm text-gray-600 hover:bg-gray-50 transition">
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
