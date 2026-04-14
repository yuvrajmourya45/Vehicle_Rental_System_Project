import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import API from "../../services/api";

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      
      if (data.role === 'owner') navigate('/owner/dashboard');
      else navigate('/user/home');
    } catch (err) {
      const errData = err.response?.data;
      if (errData?.errors?.length > 0) {
        setError(errData.errors.join(', '));
      } else {
        setError(errData?.message || 'Signup failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
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
          <Link to="/login" className="px-4 py-2 text-blue-600 font-medium">Login</Link>
          <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-xl">Signup</Link>
        </div>
      </nav>

      <div className="flex items-center justify-center px-4 py-8">
        <div className="max-w-sm w-full">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-600">Sign up to get started</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            {error && <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Full Name</label>
                <div className="flex items-center border rounded-xl px-4 py-2">
                  <User size={20} className="text-gray-400 mr-2" />
                  <input 
                    type="text" 
                    className="outline-none w-full" 
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <div className="flex items-center border rounded-xl px-4 py-2">
                  <Mail size={20} className="text-gray-400 mr-2" />
                  <input 
                    type="email" 
                    className="outline-none w-full" 
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Password</label>
                <div className="flex items-center border rounded-xl px-4 py-2">
                  <Lock size={20} className="text-gray-400 mr-2" />
                  <input 
                    type="password" 
                    className="outline-none w-full" 
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Role</label>
                <select 
                  className="w-full border rounded-xl px-4 py-2 outline-none"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="user">User</option>
                  <option value="owner">Vehicle Owner</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={20} className="animate-spin" />}
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>

            <p className="text-center mt-4 text-gray-600 text-sm">
              Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
