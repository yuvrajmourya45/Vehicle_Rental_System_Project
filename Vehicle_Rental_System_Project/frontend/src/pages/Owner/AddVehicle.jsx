import React, { useState } from "react";
import OwnerSidebar from "../../components/OwnerSidebar";
import { Upload, Loader2 } from "lucide-react";
import API from "../../services/api";

export default function AddVehicle() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    seats: "",
    fuel: "",
    transmission: "",
    description: "",
    images: []
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    
    try {
      const formDataUpload = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key !== 'images' && formData[key]) {
          formDataUpload.append(key, formData[key]);
        }
      });
      
      // Add image file if selected
      if (selectedFile) {
        console.log('Adding file:', selectedFile.name, selectedFile.type);
        formDataUpload.append('image', selectedFile);
      }
      
      console.log('Submitting form data...');
      const response = await API.post('/vehicles', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      console.log('Vehicle created:', response.data);
      setSuccess(true);
      setFormData({ name: "", category: "", price: "", seats: "", fuel: "", transmission: "", description: "", images: [] });
      setSelectedFile(null);
      setPreviewUrl('');
    } catch (err) {
      console.error('Error creating vehicle:', err);
      setError(err.response?.data?.message || err.message || 'Failed to add vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <OwnerSidebar />
      
      <div className="md:ml-56 flex-1 bg-gray-100 min-h-screen p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 mt-12 md:mt-0">Add New Vehicle</h1>
        
        <div className="bg-white rounded-xl shadow p-4 md:p-6 max-w-5xl">
          {error && <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">{error}</div>}
          {success && <div className="bg-green-50 text-green-600 px-4 py-2 rounded-lg mb-4 text-sm">Vehicle added successfully!</div>}
          
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Vehicle Name</label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-1.5"
                placeholder="BMW 4 Series"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  className="w-full border rounded-lg px-3 py-1.5"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                >
                  <option value="">Select</option>
                  <option value="Car">Car</option>
                  <option value="Bike">Bike</option>
                  <option value="Bus">Bus</option>
                  <option value="Truck">Truck</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Price per Day ($)</label>
                <input
                  type="number"
                  className="w-full border rounded-lg px-3 py-1.5"
                  placeholder="120"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Seats</label>
                <input
                  type="number"
                  className="w-full border rounded-lg px-3 py-1.5"
                  placeholder="4"
                  value={formData.seats}
                  onChange={(e) => setFormData({...formData, seats: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Fuel Type</label>
                <select
                  className="w-full border rounded-lg px-3 py-1.5"
                  value={formData.fuel}
                  onChange={(e) => setFormData({...formData, fuel: e.target.value})}
                  required
                >
                  <option value="">Select</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Transmission</label>
                <select
                  className="w-full border rounded-lg px-3 py-1.5"
                  value={formData.transmission}
                  onChange={(e) => setFormData({...formData, transmission: e.target.value})}
                  required
                >
                  <option value="">Select</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                className="w-full border rounded-lg px-3 py-1.5"
                rows="2"
                placeholder="Describe your vehicle..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Upload Image</label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <Upload className="mx-auto mb-1 text-gray-400" size={28} />
                <p className="text-sm text-gray-600 mb-2">Click to upload vehicle image (JPG, PNG, GIF, WEBP, AVIF)</p>
                <input 
                  type="file" 
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/avif"
                  onChange={handleFileChange}
                  className="hidden" 
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 inline-block">
                  Choose Image
                </label>
              </div>
              {previewUrl && (
                <div className="mt-2">
                  <img src={previewUrl} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={20} className="animate-spin" />}
              {loading ? 'Adding Vehicle...' : 'Add Vehicle'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
