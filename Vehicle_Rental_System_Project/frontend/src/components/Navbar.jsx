import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, User, LogOut, Menu, X } from "lucide-react";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <nav className="bg-white shadow-md px-4 sm:px-6 lg:px-8 py-4 relative">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="flex-shrink-0">
          <h1 className="text-xl sm:text-2xl font-bold text-blue-600">CarRental</h1>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex space-x-8">
          <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition">Home</Link>
          <Link to="/vehicles" className="text-gray-700 hover:text-blue-600 font-medium transition">Vehicles</Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium transition">About</Link>
          <Link to="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition">Contact</Link>
        </div>
        
        {/* Desktop Auth */}
        <div className="hidden sm:flex items-center space-x-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-sm sm:text-base"
              >
                <User size={16} className="sm:w-5 sm:h-5" />
                <span className="max-w-24 sm:max-w-none truncate">{user.name}</span>
                <ChevronDown size={16} className="sm:w-5 sm:h-5" />
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border z-50">
                  <Link
                    to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'owner' ? '/owner/dashboard' : '/user/home'}
                    className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 rounded-t-xl text-sm"
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
                    className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-100 rounded-b-xl text-left text-red-600 text-sm"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="px-3 sm:px-4 py-2 text-blue-600 font-medium text-sm sm:text-base">Login</Link>
              <Link to="/signup" className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-sm sm:text-base">Signup</Link>
            </>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden p-2 text-gray-600 hover:text-blue-600 transition"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t z-50">
          <div className="px-4 py-2 space-y-1">
            <Link 
              to="/" 
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/vehicles" 
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Vehicles
            </Link>
            <Link 
              to="/about" 
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            
            {/* Mobile Auth */}
            <div className="border-t pt-2 mt-2">
              {user ? (
                <>
                  <Link
                    to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'owner' ? '/owner/dashboard' : '/user/home'}
                    className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User size={18} />
                    Dashboard ({user.name})
                  </Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('user');
                      window.location.href = '/';
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition text-left"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="block px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="block px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-center mt-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Signup
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="sm:hidden fixed inset-0 bg-black bg-opacity-25 z-40" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
}
