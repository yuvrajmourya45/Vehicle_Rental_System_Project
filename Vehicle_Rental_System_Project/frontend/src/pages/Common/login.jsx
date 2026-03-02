import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import API from "../../services/api";

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    setError('');
    setLoading(true);
    
    try {
      const { data } = await API.post('/auth/login', formData);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      
      setTimeout(() => {
        if (data.role === 'admin') {
          window.location.replace('/admin/dashboard');
        } else if (data.role === 'owner') {
          window.location.replace('/owner/dashboard');
        } else {
          window.location.replace('/user/home');
        }
      }, 100);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Simplified Navbar */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-xl sm:text-2xl font-bold text-blue-600">CarRental</h1>
          </Link>
          <div className="hidden sm:flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition">Home</Link>
            <Link to="/vehicles" className="text-gray-700 hover:text-blue-600 transition">Vehicles</Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 transition">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition">Contact</Link>
          </div>
          <div className="flex items-center space-x-3">
            <Link to="/login" className="px-3 sm:px-4 py-2 text-blue-600 font-medium text-sm sm:text-base">Login</Link>
            <Link to="/signup" className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-sm sm:text-base">Signup</Link>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="flex items-center justify-center px-4 py-8 sm:py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-blue-600" size={24} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-600 text-sm sm:text-base">Sign in to your account to continue</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                <p className="font-medium">Login Failed</p>
                <p>{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="text-gray-400" size={18} />
                  </div>
                  <input 
                    type="email" 
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm sm:text-base" 
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="text-gray-400" size={18} />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm sm:text-base" 
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 sm:py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition text-sm sm:text-base"
              >
                {loading && <Loader2 size={18} className="animate-spin" />}
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm sm:text-base">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-600 font-semibold hover:text-blue-700 transition">
                  Create one here
                </Link>
              </p>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2 text-sm">Demo Credentials:</h3>
            <div className="text-xs sm:text-sm text-gray-600 space-y-1">
              <p><strong>User:</strong> user@demo.com / password123</p>
              <p><strong>Owner:</strong> owner@demo.com / password123</p>
              <p><strong>Admin:</strong> admin@demo.com / password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
