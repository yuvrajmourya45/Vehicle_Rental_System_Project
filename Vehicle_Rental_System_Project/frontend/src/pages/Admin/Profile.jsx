import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { User, Mail, Phone, MapPin, Loader2, Shield } from "lucide-react";
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
      
      <div className="md:ml-56 flex-1 bg-gray-50 min-h-screen p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-8 mt-12 md:mt-0 text-gray-800">My Profile</h1>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-32"></div>
          
          <div className="px-6 md:px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16">
              <div className="w-32 h-32 rounded-full bg-white p-1.5 shadow-lg">
                <div className="w-full h-full rounded-full bg-purple-600 text-white flex items-center justify-center text-4xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </div>
              
              <div className="flex-1 mb-2">
                <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium capitalize">
                    {user?.role}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user?.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {user?.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mt-10">
              <div className="p-5 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="text-purple-600" size={22} />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="font-medium text-gray-800">{user?.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-5 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Phone className="text-purple-600" size={22} />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Phone</p>
                    <p className="font-medium text-gray-800">{user?.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-5 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <MapPin className="text-purple-600" size={22} />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Address</p>
                    <p className="font-medium text-gray-800">{user?.address || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-5 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="text-purple-600" size={22} />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">KYC Status</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${
                      user?.kycStatus === 'verified' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {user?.kycStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
