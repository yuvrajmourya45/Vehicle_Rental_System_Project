import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { User, Mail, Phone, MapPin, Loader2 } from "lucide-react";
import API from "../../services/api";

export default function AdminProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get('/auth/me');
      setUser(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex"><AdminSidebar /><div className="md:ml-56 flex-1 flex items-center justify-center h-screen"><Loader2 size={48} className="animate-spin text-purple-600" /></div></div>
  );

  return (
    <div className="flex">
      <AdminSidebar />
      
      <div className="md:ml-56 flex-1 bg-gray-100 min-h-screen p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 mt-12 md:mt-0">My Profile</h1>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-2xl">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-32"></div>
          
          <div className="px-6 pb-6">
            <div className="flex flex-col items-center -mt-16">
              <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center">
                <div className="w-28 h-28 rounded-full bg-purple-600 text-white flex items-center justify-center text-4xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mt-4">{user?.name}</h2>
              <span className="px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mt-2 capitalize">
                {user?.role}
              </span>
            </div>
            
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="text-purple-600" size={20} />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Phone className="text-purple-600" size={20} />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-medium">{user?.phone || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <MapPin className="text-purple-600" size={20} />
                <div>
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="font-medium">{user?.address || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <User className="text-purple-600" size={20} />
                <div>
                  <p className="text-xs text-gray-500">Account Status</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                    user?.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {user?.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
