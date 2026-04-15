import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Car, CreditCard, User, Menu, X, LogOut } from "lucide-react";

export default function UserSidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/user/home", icon: LayoutDashboard },
    { name: "My Bookings", path: "/user/bookings", icon: FileText },
    { name: "Browse Vehicles", path: "/vehicles", icon: Car },
    { name: "Payments", path: "/user/payments", icon: CreditCard },
    { name: "Profile", path: "/user/profile", icon: User },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 bg-white text-gray-700 rounded-lg shadow-lg border border-gray-200"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className={`w-56 bg-white h-screen shadow-lg fixed left-0 top-0 z-40 flex flex-col transition-transform ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        {/* Brand */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 bg-green-600 rounded-md flex items-center justify-center">
              <Car size={14} className="text-white" />
            </div>
            <span className="font-bold text-gray-800 text-sm leading-tight">The Precision<br/>Concierge</span>
          </div>
          <p className="text-xs text-gray-400 ml-9">Premium Vehicle Fleet</p>
        </div>

        {/* Nav */}
        <nav className="p-3 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm font-medium transition ${
                  isActive
                    ? "bg-green-50 text-green-600 border-l-4 border-green-600"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                <Icon size={17} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={() => { localStorage.clear(); window.location.href = '/'; }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition text-sm w-full font-medium"
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="md:hidden fixed inset-0 bg-black bg-opacity-40 z-30" />
      )}
    </>
  );
}
