import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
 
export default function UserHome() {
  const navigate = useNavigate();
 

  const handleMyBookings = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      alert('Please login to view your bookings');
      navigate('/auth/login');
      return;
    }
    
    const userData = JSON.parse(user);
    if (userData.type === 'Owner') {
      navigate('/owner/home');
    } else if (userData.type === 'Renter') {
      navigate('/renter/bookings');
    } 
    else if (userData.type === 'Admin') {
      navigate('/admin/home');
    }else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />

    <title>User Home - RentHub</title>


      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24">
        {/* Background gradient */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Content */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Find Your Perfect
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Rental Home
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Browse verified rental properties, explore detailed listings, and manage your bookings in one place.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/renter/all-properties"
                className="px-8 py-3 md:py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 transform"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"></path>
                    <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z" clipRule="evenodd"></path>
                  </svg>
                  All Properties
                </span>
              </Link>
              <button
                onClick={handleMyBookings}
                className="px-8 py-3 md:py-4 bg-slate-700/50 hover:bg-slate-700 border-2 border-slate-600 hover:border-purple-500 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"></path>
                  </svg>
                  My Bookings
                </span>
              </button>
            </div>

            {/* Featured Property Preview */}
            <div className="hidden md:block max-w-2xl mx-auto">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50 bg-slate-800/30 backdrop-blur">
                <img
                  src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&h=400&q=80"
                  alt="Featured Property"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-full text-sm font-semibold">
                    Featured Property
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent p-6">
                  <h3 className="text-2xl font-bold mb-1">Modern Minimalist Villa</h3>
                  <p className="text-slate-300">4 Bed • 3 Bath • $4,200/mo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     

      {/* Stats Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {/* Stat 1 */}
            <div className="text-center p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/50 transition-all">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
                15k+
              </div>
              <p className="text-slate-300 font-medium">Verified Homes</p>
            </div>

            {/* Stat 2 */}
            <div className="text-center p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/50 transition-all">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <p className="text-slate-300 font-medium">Customer Support</p>
            </div>

            {/* Stat 3 */}
            <div className="text-center p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/50 transition-all">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent mb-2">
                100%
              </div>
              <p className="text-slate-300 font-medium">Secure Payments</p>
            </div>

            {/* Stat 4 */}
            <div className="text-center p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/50 transition-all">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent mb-2">
                4.9/5
              </div>
              <p className="text-slate-300 font-medium">User Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Dream Home?</h2>
          <p className="text-lg text-slate-300 mb-8">
            Join thousands of happy renters and property owners on HouseHub. Start your journey today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/renter/all-properties"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 transform"
            >
              Browse Properties
            </Link>
            <Link
              to="/auth/register"
              className="px-8 py-4 bg-slate-700/50 hover:bg-slate-700 border-2 border-slate-600 hover:border-purple-500 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
