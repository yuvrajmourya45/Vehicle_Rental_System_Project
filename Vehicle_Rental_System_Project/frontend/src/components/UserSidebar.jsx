import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, FileText, CreditCard, User, Menu, X, LogOut, LayoutDashboard, Car, Users, DollarSign, UserCog } from "lucide-react";

export default function UserSidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Home", path: "/user/home", icon: Home },
    { name: "My Bookings", path: "/user/bookings", icon: FileText },
    { name: "Payment History", path: "/user/payments", icon: CreditCard },
    { name: "Profile", path: "/user/profile", icon: User },
  ];

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className="md:hidden fixed top-4 left-4 z-50 p-2 bg-green-600 text-white rounded-lg">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`w-56 bg-white h-screen shadow-lg fixed left-0 top-0 z-40 transition-transform flex flex-col ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-green-600">User Panel</h2>
        </div>
        
        <nav className="p-3 flex-1 overflow-y-auto">
          <Link to="/" className="flex items-center gap-2 px-3 py-2.5 rounded-lg mb-3 bg-green-50 text-green-600 hover:bg-green-100 transition text-sm border border-green-200">
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
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg mb-2 transition text-sm ${
                  isActive ? "bg-green-600 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-3 border-t">
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = '/';
            }}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition text-sm w-full text-left"
          >
            <LogOut size={18} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {isOpen && <div onClick={() => setIsOpen(false)} className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30" />}
    </>
  );
}
