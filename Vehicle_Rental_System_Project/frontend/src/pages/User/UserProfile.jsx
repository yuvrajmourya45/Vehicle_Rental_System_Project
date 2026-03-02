import React, { useState} from "react";
import UserSidebar from "../../components/UserSidebar";
import { User, Mail, Phone, MapPin} from "lucide-react";

export default function UserProfile() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [profileData, setProfileData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: "",
    address: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="flex">
      <UserSidebar />
      
      <div className="md:ml-56 flex-1 bg-gray-100 min-h-screen p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 mt-12 md:mt-0">Profile</h1>
        
        <div className="bg-white rounded-xl shadow p-4 md:p-6 max-w-4xl">
          <div className="flex items-center gap-4 mb-4 pb-4 border-b">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {getInitials(profileData.name || 'U')}
            </div>
            <div>
              <h2 className="text-xl font-bold">{profileData.name}</h2>
              <p className="text-gray-600 text-sm">Customer</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <div className="flex items-center border rounded-lg px-3 py-1.5">
                  <User size={18} className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    className="w-full outline-none"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <div className="flex items-center border rounded-lg px-3 py-1.5">
                  <Mail size={18} className="text-gray-400 mr-2" />
                  <input
                    type="email"
                    className="w-full outline-none"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <div className="flex items-center border rounded-lg px-3 py-1.5">
                  <Phone size={18} className="text-gray-400 mr-2" />
                  <input
                    type="tel"
                    className="w-full outline-none"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <div className="flex items-center border rounded-lg px-3 py-1.5">
                  <MapPin size={18} className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    className="w-full outline-none"
                    value={profileData.address}
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700">
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
