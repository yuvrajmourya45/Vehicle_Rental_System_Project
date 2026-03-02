import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, FileText, CreditCard, User, Menu, X, LogOut } from "lucide-react";

export default function UserSidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/user/home", icon: Home },
    { name: "My Bookings", path: "/user/bookings", icon: FileText },
    { name: "Payments", path: "/user/payments", icon: CreditCard },
    { name: "Profile", path: "/user/profile", icon: User },
  ];

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className={`w-64 sm:w-56 bg-white h-screen shadow-xl fixed left-0 top-0 z-40 transition-transform flex flex-col ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        <div className="p-4 sm:p-3 border-b bg-green-50">
          <h2 className="text-lg sm:text-xl font-bold text-green-600">User Panel</h2>
        </div>
        
        <nav className="p-3 flex-1 overflow-y-auto">
          <Link 
            to="/" 
            className="flex items-center gap-2 sm:gap-3 px-3 py-2.5 rounded-lg mb-3 bg-green-50 text-green-600 hover:bg-green-100 transition text-sm border border-green-200"
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
                  isActive ? "bg-green-600 text-white shadow-md" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-3 border-t bg-gray-50">
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
