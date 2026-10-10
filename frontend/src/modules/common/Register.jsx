import   { useState } from 'react';
import { Link } from 'react-router-dom';
 import axios from 'axios'
import api from '../../../api.js'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    type: '',
  });

  const [status, setStatus] = useState({
    type: '', // 'success' | 'error' | ''
    message: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear status when user types
    if (status.message) {
      setStatus({ type: '', message: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, phoneNumber, type } = formData;

    // Simple validation
    if (!name.trim()) {
      setStatus({ type: 'error', message: 'Full name is required.' });
      return;
    }
    if (!email.trim()) {
      setStatus({ type: 'error', message: 'Email address is required.' });
      return;
    }
    if (!password) {
      setStatus({ type: 'error', message: 'Password is required.' });
      return;
    }
    if (password.length < 6) {
      setStatus({ type: 'error', message: 'Password must be at least 6 characters.' });
      return;
    }
    if (!phoneNumber.trim()) {
      setStatus({ type: 'error', message: 'Phone number is required.' });
      return;
    }
    if (!type) {
      setStatus({ type: 'error', message: 'Please select a user type.' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await axios.post(`${api}/api/users/register`, formData);

      if (response.data) {
        setStatus({
          type: 'success',
          message:response.data.message,
        });
        setFormData({ name: '', email: '', password: '', phoneNumber: '', type: '' });
        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 2000);
      } else {
        setStatus({
          type: 'error',
          message: response.data.message || 'Registration failed. Please try again.',
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setStatus({
        type: 'error',
        message:
          error.response?.data?.message ||
          (error.response
            ? 'Registration failed. Please check your details and try again.'
            : 'Unable to connect to the server. Please check your connection.'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
        <title>Register - HouseHub</title>


      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 md:py-16 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
        {/* Card Container */}
        <div className="w-full max-w-[440px] p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-2xl shadow-black/50 transition-all duration-300 hover:border-slate-700/60">
          
          {/* Card Header & Icon */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-b from-indigo-950 to-slate-900 border border-indigo-500/30 shadow-inner mb-4 relative overflow-hidden group">
              {/* Subtle pulsing background glow */}
              <div className="absolute inset-0 bg-indigo-500/10 opacity-50 group-hover:scale-110 transition-transform duration-300"></div>
              {/* Document/Notepad SVG Icon */}
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10 text-indigo-400 group-hover:rotate-6 transition-transform duration-300"
              >
                {/* Pad Base */}
                <path
                  d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3H19Z"
                  fill="#ffffff"
                  className="fill-slate-100"
                />
                {/* Spiral binder holes / rings at the top */}
                <path
                  d="M6 2V4M12 2V4M18 2V4"
                  stroke="#6366f1"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {/* Horizontal lined details */}
                <path
                  d="M6 8H14M6 12H12M6 16H10"
                  stroke="#3b82f6"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                {/* Pencil Drawing */}
                <path
                  d="M15 15.5L18.5 12L20.5 14L17 17.5L15 15.5Z"
                  fill="#f59e0b"
                />
                {/* Pencil Tip */}
                <path
                  d="M14 16.5L15 15.5L14.5 18L14 16.5Z"
                  fill="#1e293b"
                />
                {/* Pencil Eraser */}
                <rect
                  x="19.5"
                  y="11"
                  width="2.5"
                  height="1.5"
                  rx="0.5"
                  transform="rotate(45 19.5 11)"
                  fill="#ef4444"
                />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Sign Up
            </h2>
          </div>

          {/* Alert messages */}
          {status.message && (
            <div
              className={`mb-5 p-3.5 rounded-lg text-sm font-medium border flex items-start gap-2.5 animate-fadeIn ${
                status.type === 'success'
                  ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-950/60 border-rose-500/30 text-rose-400'
              }`}
            >
              {status.type === 'success' ? (
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
              <span>{status.message}</span>
            </div>
          )}

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name Input */}
            <div>
              <label htmlFor="name" className="sr-only">
                Renter Full Name / Owner Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Renter Full Name / Owner Name"
                className="w-full px-4 py-3 rounded-lg bg-slate-800/40 border border-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent transition-all duration-200 text-sm"
              />
            </div>

            {/* Email Address Input */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full px-4 py-3 rounded-lg bg-slate-800/40 border border-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent transition-all duration-200 text-sm"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-3 rounded-lg bg-slate-800/40 border border-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent transition-all duration-200 text-sm"
              />
            </div>

               {/* Phone Number Input */}
            <div>
              <label htmlFor="phoneNumber" className="sr-only">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full px-4 py-3 rounded-lg bg-slate-800/40 border border-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent transition-all duration-200 text-sm"
              />
            </div>

            {/* User Type Select */}
            <div>
              <label htmlFor="type" className="sr-only">
                Select User Type
              </label>
              <div className="relative">
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/40 border border-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent transition-all duration-200 text-sm appearance-none cursor-pointer"
                >
                  <option value="" disabled className="bg-slate-900 text-slate-400">
                    Select User Type
                  </option>
                  <option value="Renter" className="bg-slate-900 text-white">
                    Renter
                  </option>
                  <option value="Owner" className="bg-slate-900 text-white">
                    Owner
                  </option>
                  <option value="Admin" className="bg-slate-900 text-white">
                    Admin 
                  </option>
                </select>
                {/* Custom dropdown arrow */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 mt-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-indigo-900/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950 flex items-center justify-center gap-2 ${
                loading ? 'opacity-80 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing Up...</span>
                </>
              ) : (
                'Sign Up'
              )}
            </button>

          </form>

          {/* Footer Navigation */}
          <div className="mt-6 text-center text-sm">
            <span className="text-rose-400 font-medium">Have an account?</span>
            <Link
              to="/auth/login"
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200 ml-1.5 focus:outline-none focus:underline"
            >
              Sign In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
