import   { useState,useRef ,useEffect} from 'react';
 
import {Link} from 'react-router-dom';
import axios from 'axios';
import api from '../../../api';
export default function Login() {
  const emailRef = useRef(null);
   const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [status, setStatus] = useState({
    type: '', // 'success' | 'error' | ''
    message: '',
  });

  const [loading, setLoading] = useState(false);

useEffect(()=>{
  emailRef.current.focus();
},[]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear status when typing
    if (status.message) {
      setStatus({ type: '', message: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    // Validation
    if (!email.trim()) {
      setStatus({ type: 'error', message: 'Email address is required.' });
      return;
    }
    if (!password) {
      setStatus({ type: 'error', message: 'Password is required.' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await axios.post(`${api}/api/users/login`,formData);

      if (response.data) {
        setStatus({
          type: 'success',
          message: response.data.message,
        });
        
        // Save token and user details to localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.resUser));
 
        setFormData({ email: '', password: '' });
        setTimeout(()=>{

          window.location.href = '/';

        },2000);
      
      } else {
        setStatus({
          type: 'error',
          message: response.data.message || 'Invalid email or password.',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'An error occurred during login. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      {/* <Navbar /> */}
    <title>Login - HouseHub</title>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 md:py-16 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
        {/* Card Container */}
        <div className="w-full max-w-[440px] p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-2xl shadow-black/50 transition-all duration-300 hover:border-slate-700/60">
          
          {/* Card Header & Icon */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-b from-indigo-950 to-slate-900 border border-indigo-500/30 shadow-inner mb-4 relative overflow-hidden group">
              {/* Subtle pulsing background glow */}
              <div className="absolute inset-0 bg-indigo-500/10 opacity-50 group-hover:scale-110 transition-transform duration-300"></div>
              {/* Lock SVG Icon */}
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10 text-indigo-400 group-hover:scale-105 transition-transform duration-300"
              >
                {/* Lock body */}
                <rect x="5" y="11" width="14" height="10" rx="2" fill="white" className="fill-slate-100" />
                {/* Lock shackle */}
                <path
                  d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11"
                  stroke="#6366f1"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Keyhole */}
                <circle cx="12" cy="15" r="1.5" fill="#1e293b" />
                <path d="M12 16.5V18.5" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Sign In
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

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Address Input */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                ref={emailRef}
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
                  <span>Signing In...</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>

          </form>

          {/* Footer Navigation */}
          <div className="mt-6 text-center text-sm">
            <span className="text-rose-400 font-medium">Don't have an account?</span>
            <Link
              to="/auth/register"
               className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200 ml-1.5 focus:outline-none focus:underline"
            >
              Sign Up
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}