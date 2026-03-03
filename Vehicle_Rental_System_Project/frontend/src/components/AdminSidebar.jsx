import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, UserCheck, Car, FileText, Menu, X, LogOut, User, Home } from "lucide-react";

export default function AdminSidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Manage Users", path: "/admin/users", icon: Users },
    { name: "Manage Owners", path: "/admin/owners", icon: UserCheck },
    { name: "Manage Vehicles", path: "/admin/vehicles", icon: Car },
    { name: "All Bookings", path: "/admin/bookings", icon: FileText },
    { name: "Profile", path: "/admin/profile", icon: User },
  ];

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className={`w-64 sm:w-56 bg-white shadow-xl fixed left-0 top-0 z-40 transition-transform flex flex-col h-screen ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        <div className="p-4 sm:p-3 border-b bg-blue-50 flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-bold text-blue-600">Admin Panel</h2>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-3">
          <Link 
            to="/" 
            className="flex items-center gap-2 sm:gap-3 px-3 py-2.5 rounded-lg mb-3 bg-blue-50 text-blue-600 hover:bg-blue-100 transition text-sm border border-blue-200"
            onClick={() => setIsOpen(false)}
          >
            <Home size={18} />
            <span className="font-medium">Back to Website</span>
          </Link>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 sm:gap-3 px-3 py-2.5 rounded-lg mb-2 transition text-sm font-medium ${
                  isActive ? "bg-blue-600 text-white shadow-md" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-3 border-t bg-gray-50 flex-shrink-0">
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = '/';
            }}
            className="flex items-center gap-2 sm:gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition text-sm w-full text-left font-medium"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity" 
        />
      )}
    </>
  );
}
