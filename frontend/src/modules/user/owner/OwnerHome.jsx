import { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../../../api.js';
import Navbar from '../../../components/Navbar.jsx';
import OwnerProperties from './ownerProperties.jsx'
import OwnerBookings from './ownerBookings.jsx';

export default function OwnerHome() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [activeTab, setActiveTab] = useState('Add Property');

  // Form State
  const [formData, setFormData] = useState({
    propertyType: 'Residential',
    propertyAdType: 'Rent',
    propertyAddress: '',
    ownerContact: '',
    propertyAmount: 0,
    availability: true,
    additionalDetails: '',
  });

  // Status Alerts State
  const [status, setStatus] = useState({
    type: '', // 'success' | 'error' | ''
    message: '',
  });
  const [loading, setLoading] = useState(false);
  // all properties to display in homePage
  useEffect(() => {
    const intialization = () => {
      const Orginaluser = localStorage.getItem('user');
      const token = localStorage.getItem("token");
      const user = JSON.parse(Orginaluser)

      if (!token || !user) return window.location.href = "/auth/login";

      setUser(user);
      setToken(token);
    }
    intialization();
  }, [])


  // OwnerDetails
  useEffect(() => {
    const fetchOwnerDetails = async () => {
      if (user) {

        const response = await axios.get(`${api}/api/owner/ownerDetails/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data.owner.PermissionStatus === 'Ungrant') {
          alert("your are not permissioned to create new property");
          return window.location.href = "/";
        }
      }
    }

    fetchOwnerDetails();
  }, [token,user]);

  // Handle inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'propertyAmount' ? Number(value) : value,
    }));
    // Clear status
    if (status.message) {
      setStatus({ type: '', message: '' });
    }
  };


  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      propertyType,
      propertyAdType,
      propertyAddress,
      ownerContact,
      propertyAmount,
      additionalDetails,
      availability
    } = formData;

    // Validations
    if (!propertyAddress.trim()) {
      setStatus({ type: 'error', message: 'Property full address is required.' });
      return;
    }
    if (!ownerContact.trim()) {
      setStatus({ type: 'error', message: 'Owner contact number is required.' });
      return;
    }
    if (propertyAmount <= 0) {
      setStatus({ type: 'error', message: 'Property amount must be greater than 0.' });
      return;
    }
    if (!additionalDetails.trim()) {
      setStatus({ type: 'error', message: 'Additional details for the property are required.' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await axios.post(
        `${api}/api/owner/newProperty`,
        {
          ownerId: user._id,
          OwnerName: user.name,
          propertyType,
          propertyAdType,
          propertyAddress,
          ownerContact,
          propertyAmount,
          availability,
          additionalDetails,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.success) {
        setStatus({
          type: 'success',
          message: 'Property created successfully!',
        });

        // Reset form
        setFormData({
          propertyType: 'Residential',
          propertyAdType: 'Rent',
          propertyAddress: '',
          ownerContact: '',
          propertyAmount: 0,
          additionalDetails: '',
          availability: true,
        });

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setStatus({
          type: 'error',
          // message: response.data.message || 'Failed to create property.',
          message: 'Failed to create property.',

        });
      }
    }
    catch (error) {
      console.error('Submit property error:', error);
      setStatus({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Server connection error. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };




  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="animate-spin h-10 w-10 border-t-2 border-indigo-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080d19] text-white flex flex-col font-sans selection:bg-indigo-500 selection:text-white pb-12">
      <Navbar user={user} />
      <title>OwnerHome - RentHub</title>

      {/* Tabs Selector Bar */}
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 mt-4">
        <div className="flex gap-8 border-b border-slate-800/80 pb-3">
          {['Add Property', 'All Properties', 'All Bookings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative font-semibold text-sm transition-all duration-200 pb-3 -mb-3 cursor-pointer ${activeTab === tab
                  ? 'text-[#5969f6]'
                  : 'text-slate-400 hover:text-white'
                }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#5969f6] rounded-full shadow-[0_0_8px_#5969f6]"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area Container */}
      <main className="max-w-7xl mx-auto w-full px-6 md:px-12 mt-8 flex-1">
        <div className="border border-slate-800/80 rounded-2xl p-6 md:p-10 bg-[#0c1325]/40 backdrop-blur-sm min-h-[500px] flex flex-col">
          {activeTab === 'Add Property' ? (
            <div className="w-full max-w-5xl mx-auto bg-[#0d1527] border border-slate-800/90 rounded-2xl p-8 md:p-10 shadow-2xl relative">
              {/* Form Title */}
              <h2 className="text-3xl font-extrabold text-center text-[#5969f6] mb-10 tracking-tight">
                Add New Property
              </h2>

              {/* Status Alert Overlay/Notifications */}
              {status.message && (
                <div
                  className={`mb-6 p-4 rounded-xl text-sm font-semibold border flex items-start gap-3 animate-fadeIn ${status.type === 'success'
                      ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400'
                      : 'bg-rose-950/80 border-rose-500/40 text-rose-400'
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

              {/* Property Details Form */}
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* 3 Column Grid layout matching the reference image */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                  {/* Property Type Dropdown */}
                  <div className="flex flex-col">
                    <label className="text-slate-300 font-semibold text-sm mb-2">
                      Property Type
                    </label>
                    <div className="relative">
                      <select
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleChange}
                        className="w-full bg-[#182035] border border-slate-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer text-sm"
                      >
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Villa">Villa</option>
                        <option value="House">House</option>
                        <option value="Penthouse">Penthouse</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Property Ad Type Dropdown */}
                  <div className="flex flex-col">
                    <label className="text-slate-300 font-semibold text-sm mb-2">
                      Property Ad Type
                    </label>
                    <div className="relative">
                      <select
                        name="propertyAdType"
                        value={formData.propertyAdType}
                        onChange={handleChange}
                        className="w-full bg-[#182035] border border-slate-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer text-sm"
                      >
                        <option value="Rent">Rent</option>
                        <option value="Sale">Sale</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Property Full Address */}
                  <div className="flex flex-col">
                    <label className="text-slate-300 font-semibold text-sm mb-2">
                      Property Full Address
                    </label>
                    <input
                      type="text"
                      name="propertyAddress"
                      value={formData.propertyAddress}
                      onChange={handleChange}
                      placeholder="Address"
                      className="w-full bg-[#182035] border border-slate-800 rounded-lg py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                    />
                  </div>

                  {/* Owner Contact Number */}
                  <div className="flex flex-col">
                    <label className="text-slate-300 font-semibold text-sm mb-2">
                      Owner Contact No.
                    </label>
                    <input
                      type="text"
                      name="ownerContact"
                      value={formData.ownerContact}
                      onChange={handleChange}
                      placeholder="Contact number"
                      className="w-full bg-[#182035] border border-slate-800 rounded-lg py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                    />
                  </div>

                  {/* Property Amount */}
                  <div className="flex flex-col">
                    <label className="text-slate-300 font-semibold text-sm mb-2">
                      Property Amount
                    </label>
                    <input
                      type="number"
                      name="propertyAmount"
                      value={formData.propertyAmount}
                      onChange={handleChange}
                      placeholder="0"
                      className="w-full bg-[#182035] border border-slate-800 rounded-lg py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-slate-300 font-semibold text-sm mb-2">
                      Availability
                    </label>
                    <div className="relative">
                      <select
                        name="availability"
                        value={formData.availability}
                        onChange={handleChange}
                        className="w-full bg-[#182035] border border-slate-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer text-sm"
                      >
                        <option value={true}>Available</option>
                        <option value={false}>Not Available</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Details (Full Width) */}
                <div className="flex flex-col">
                  <label className="text-slate-300 font-semibold text-sm mb-2">
                    Additional Details for the Property
                  </label>
                  <textarea
                    name="additionalDetails"
                    value={formData.additionalDetails}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Add any details here..."
                    className="w-full bg-[#182035] border border-slate-800 rounded-lg py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm resize-none"
                  ></textarea>
                </div>

                {/* Submit Form Button Container */}
                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`bg-[#5969f6] hover:bg-[#4958df] text-white font-bold text-sm px-8 py-3 rounded-lg transition-all duration-200 shadow-lg active:scale-95 flex items-center gap-2 cursor-pointer ${loading ? 'opacity-85 cursor-not-allowed' : ''
                      }`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      'Add Property'
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : activeTab === 'All Properties' ? (
            <OwnerProperties />
          ) : (
            <OwnerBookings />

          )}
        </div>
      </main>
    </div>
  );
}
