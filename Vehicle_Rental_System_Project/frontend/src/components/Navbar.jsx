import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, User, LogOut } from "lucide-react";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  return (
    <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
      <Link to="/">
        <h1 className="text-2xl font-bold text-blue-600">CarRental</h1>
      </Link>
      <div className="space-x-6 hidden md:flex">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <Link to="/vehicles" className="hover:text-blue-600">Vehicles</Link>
        <Link to="/about" className="hover:text-blue-600">About</Link>
        <Link to="/contact" className="hover:text-blue-600">Contact</Link>
      </div>
      <div className="space-x-4">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              <User size={18} />
              {user.name}
              <ChevronDown size={18} />
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border z-50">
                <Link
                  to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'owner' ? '/owner/dashboard' : '/user/home'}
                  className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 rounded-t-xl"
                  onClick={() => setDropdownOpen(false)}
                >
                  <User size={18} className="text-blue-600" />
                  My Dashboard
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/';
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-100 rounded-b-xl text-left text-red-600"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="px-4 py-2 text-blue-600 font-medium">Login</Link>
            <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-xl">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
