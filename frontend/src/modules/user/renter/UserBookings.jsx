import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import axios from 'axios';
import api from '../../../../api.js';

export default function UserBookings() {
  const navigate = useNavigate();
    // const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  
  // Data State
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('All');

  // Modal / Action State
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);




  // Fetch Bookings from API
  const fetchUserBookings = async (userId, userToken) => {
    setLoading(true);
     try {
      const response = await axios.get(`${api}/api/booking/user-bookings/${userId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });
       setBookings(response.data.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      // Fallback/Placeholder message handled gracefully
    } finally {
      setLoading(false);
    }
  };


  // Route Protection & Loading User Data + Fetch Bookings
  useEffect(() => {
    const initializeUser = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (!storedToken || !storedUser) {
        alert('Access Denied. Please login first.');
        navigate('/auth/login');
        return;
      }

      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.type !== 'Renter') {
          alert('Access Denied. Renter access only.');
          navigate('/');
          return;
        }
        
        setToken(storedToken);
        fetchUserBookings(parsedUser._id, storedToken);
      } catch (err) {
        console.error('Error parsing user data:', err);
        navigate('/auth/login');
      }
    };

    initializeUser();
  }, [navigate]);


  // Filter Bookings logic
  useEffect(() => {
    let result = [...bookings];

    // Status Filter
    if (statusFilter !== 'All') {
      result = result.filter(b => b.bookingStatus?.toLowerCase() === statusFilter.toLowerCase());
    }

    // Property Type Filter
    if (propertyTypeFilter !== 'All') {
      result = result.filter(b => b.propertyId?.propertyType === propertyTypeFilter);
    }

    // Search Term (Address or Owner Name)
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(b => {
        const addressMatch = b.propertyId?.propertyAddress?.toLowerCase().includes(term);
        const ownerMatch = (b.ownerId?.name || b.propertyId?.OwnerName)?.toLowerCase().includes(term);
        return addressMatch || ownerMatch;
      });
    }

    setFilteredBookings(result);
  }, [bookings, searchTerm, statusFilter, propertyTypeFilter]);

  // Open Cancel Confirmation Dialog
  const openCancelModal = (booking) => {
    setBookingToCancel(booking);
    setCancelModalOpen(true);
  };

  // Close Cancel Confirmation Dialog
  const closeCancelModal = () => {
    setBookingToCancel(null);
    setCancelModalOpen(false);
  };

  // Perform Booking Cancellation API Call
  const handleCancelBooking = async () => {
    if (!bookingToCancel) return;
    setActionLoading(true);
    try {
      const response = await axios.delete(`${api}/api/booking/bookings/cancelbooking/${bookingToCancel._id}`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

       
      // Update local state directly to reflect cancellation without hard reloading
      setBookings(prevBookings => 
        prevBookings.map(b => 
          b._id === bookingToCancel._id ? { ...b, bookingStatus: 'cancelled' } : b
        )
      );

      // Show floating notification message
      triggerAlert('Booking cancelled successfully!', 'success');
    } catch (error) {
      console.error("Error cancelling booking:", error);
      triggerAlert('Failed to cancel booking. Please try again.', 'error');
    } finally {
      setActionLoading(false);
      closeCancelModal();
    }
  };

  // Trigger temporary notification banner
  const triggerAlert = (message, type) => {
    setAlertMessage({ message, type });
    setTimeout(() => {
      setAlertMessage(null);
    }, 4000);
  };

  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#080d19] text-white flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />
      <title>My Bookings - HouseHub</title>

      {/* Background radial gradients for rich aesthetics */}
      <div className="absolute top-16 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-16 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none"></div>

      {/* Floating Notification */}
      {alertMessage && (
        <div className={`fixed top-20 right-6 z-50 p-4 rounded-xl shadow-2xl border flex items-center gap-3 transition-all duration-300 animate-fadeIn ${
          alertMessage.type === 'success' 
            ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-400' 
            : 'bg-rose-950/90 border-rose-500/40 text-rose-400'
        }`}>
          {alertMessage.type === 'success' ? (
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          <span className="font-semibold text-sm">{alertMessage.message}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-6 md:px-12 py-10 flex-1 flex flex-col relative z-10">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              My Rental Bookings
            </span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Track and manage your property booking requests, active rentals, and history.
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Column 1: Filters Sidebar */}
          <div className="lg:col-span-1 bg-[#0c1325]/50 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm self-start w-full">
            <h2 className="text-lg font-bold text-slate-200 border-b border-slate-800/80 pb-3 mb-5 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-.083.394L12 11.586V19a1 1 0 01-1.447.894L9 18V11.586L4.083 6.394A1 1 0 014 6V4z" />
              </svg>
              Filter Bookings
            </h2>

            {/* Address/Owner Search */}
            <div className="flex flex-col mb-5">
              <label className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Search</label>
              <div className="relative">
                <svg className="absolute left-3 top-3 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Address or Owner..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#182035] border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Booking Status Filter */}
            <div className="flex flex-col mb-5">
              <label className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Booking Status</label>
              <div className="space-y-2">
                {['All', 'Pending', 'Confirmed', 'Cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between ${
                      statusFilter === status
                        ? 'bg-blue-600/25 border border-blue-500/40 text-blue-400 shadow-md'
                        : 'bg-transparent border border-transparent text-slate-400 hover:text-white hover:bg-slate-800/45'
                    }`}
                  >
                    <span>{status}</span>
                    <span className={`w-2 h-2 rounded-full ${
                      status === 'All' ? 'bg-blue-400' :
                      status === 'Pending' ? 'bg-amber-400' :
                      status === 'Confirmed' ? 'bg-emerald-400' : 'bg-rose-500'
                    }`}></span>
                  </button>
                ))}
              </div>
            </div>

            {/* Property Type Filter */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Property Type</label>
              <div className="relative">
                <select
                  value={propertyTypeFilter}
                  onChange={(e) => setPropertyTypeFilter(e.target.value)}
                  className="w-full bg-[#182035] border border-slate-800 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer text-sm font-medium"
                >
                  <option value="All">All Types</option>
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

          </div>

          {/* Column 2: Bookings List/Table */}
          <div className="lg:col-span-3 bg-[#0c1325]/40 border border-slate-800/80 rounded-2xl p-6 md:p-8 backdrop-blur-sm min-h-[500px] flex flex-col w-full">
            
            {/* Quick stats on top of bookings list */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-6">
              <div className="text-base font-bold text-white flex items-center gap-2">
                <span>Bookings ({filteredBookings.length})</span>
                {statusFilter !== 'All' && (
                  <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full font-semibold capitalize">
                    {statusFilter}
                  </span>
                )}
              </div>
              <div className="flex gap-4 text-xs font-semibold text-slate-400">
                <div>Pending: <span className="text-amber-400">{bookings.filter(b => b.bookingStatus?.toLowerCase() === 'pending').length}</span></div>
                <div>Confirmed: <span className="text-emerald-400">{bookings.filter(b => b.bookingStatus?.toLowerCase() === 'confirmed').length}</span></div>
                <div>Cancelled: <span className="text-rose-400">{bookings.filter(b => b.bookingStatus?.toLowerCase() === 'cancelled').length}</span></div>
              </div>
            </div>

            {loading ? (
              /* Spinner Loader state */
              <div className="flex-1 flex flex-col items-center justify-center py-24">
                <div className="animate-spin h-10 w-10 border-t-2 border-indigo-500 rounded-full mb-4"></div>
                <p className="text-slate-400 text-sm">Fetching your booking details...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              /* Empty state */
              <div className="flex-grow flex flex-col items-center justify-center py-20 text-center">
                <div className="text-5xl mb-4 opacity-70">📁</div>
                <h3 className="text-xl font-bold text-white mb-2">No Bookings Found</h3>
                <p className="text-slate-400 text-sm max-w-sm mx-auto mb-6">
                  {bookings.length === 0 
                    ? "You haven't booked any rental homes yet. Let's find your dream place!" 
                    : "No bookings match your selected filter criteria. Try updating your filters."}
                </p>
                {bookings.length === 0 && (
                  <Link
                    to="/renter/all-properties"
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-sm rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 transform inline-block"
                  >
                    Browse Properties
                  </Link>
                )}
              </div>
            ) : (
              /* Bookings list data present */
              <div className="flex-grow flex flex-col justify-between">
                
                {/* Desktop View Table */}
                <div className="overflow-x-auto hidden md:block">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800">
                        <th className="pb-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider w-12">S No</th>
                        <th className="pb-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Property Inside</th>
                        <th className="pb-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Owner Name</th>
                        <th className="pb-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map((booking, index) => {
                        const property = booking.propertyId || {};
                        const owner = booking.ownerId || {};
                        const hasImages = property.propertyImages && property.propertyImages.length > 0;
                        const mainImage = hasImages ? property.propertyImages : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=80";
                        const status = (booking.bookingStatus || 'pending').toLowerCase();
                        
                        return (
                          <tr key={booking._id} className="border-b border-slate-800/50 hover:bg-slate-900/10 transition-colors">
                            {/* S No */}
                            <td className="py-5 text-sm font-semibold text-slate-400">
                              {index + 1}
                            </td>

                            {/* Property Details */}
                            <td className="py-5 pr-4">
                              <div className="flex gap-4 items-center">
                                <img
                                  src={mainImage}
                                  alt={property.propertyType || "Property"}
                                  className="w-20 h-14 object-cover rounded-lg border border-slate-800 bg-slate-800 shrink-0"
                                />
                                <div className="min-w-0">
                                  <p className="font-bold text-white text-sm truncate max-w-[280px]" title={property.propertyAddress}>
                                    {property.propertyAddress || "Address not available"}
                                  </p>
                                  <div className="flex gap-2 items-center mt-1">
                                    <span className="text-[10px] bg-blue-500/20 text-blue-400 font-semibold px-2 py-0.5 rounded uppercase">
                                      {property.propertyType || "N/A"}
                                    </span>
                                    <span className="text-[10px] bg-purple-500/20 text-purple-400 font-semibold px-2 py-0.5 rounded uppercase">
                                      {property.propertyAdType || "Rent"}
                                    </span>
                                    <span className="text-slate-300 font-bold text-xs ml-1">
                                      {property.propertyAmount ? formatCurrency(property.propertyAmount) : "N/A"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Owner details */}
                            <td className="py-5">
                              <div>
                                <p className="font-bold text-slate-200 text-sm">
                                  {owner.name || property.OwnerName || "Unknown Owner"}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                  { property.ownerContact || "No contact"}
                                </p>
                              </div>
                            </td>

                            {/* Cancel Button */}
                            <td className="py-5 text-right">
                              <div className="flex items-center justify-end gap-3">
                                {/* Booking Status Badge */}
                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border capitalize mr-2 ${
                                  status === 'confirmed'
                                    ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-400'
                                    : status === 'cancelled'
                                    ? 'bg-rose-950/30 border-rose-500/20 text-rose-500/70'
                                    : 'bg-amber-950/50 border-amber-500/30 text-amber-400'
                                }`}>
                                  {status}
                                </span>

                                {status !== 'cancelled' ? (
                                  <button
                                    onClick={() => openCancelModal(booking)}
                                    className="px-4 py-1.5 bg-rose-600/10 hover:bg-rose-600 hover:text-white border border-rose-600/30 text-rose-400 text-xs font-semibold rounded-lg transition-all duration-200 active:scale-95 cursor-pointer shadow-sm"
                                  >
                                    Cancel
                                  </button>
                                ) : (
                                  <button
                                    disabled
                                    className="px-4 py-1.5 bg-slate-800 text-slate-600 border border-slate-900 text-xs font-semibold rounded-lg cursor-not-allowed opacity-50"
                                  >
                                    Cancelled
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View Card List */}
                <div className="md:hidden space-y-4">
                  {filteredBookings.map((booking, index) => {
                    const property = booking.propertyId || {};
                    const owner = booking.ownerId || {};
                    const hasImages = property.propertyImages && property.propertyImages.length > 0;
                    const mainImage = hasImages ? property.propertyImages[0] : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=80";
                    const status = (booking.bookingStatus || 'pending').toLowerCase();
                    
                    return (
                      <div key={booking._id} className="bg-[#0f172a]/70 border border-slate-800 rounded-xl p-5 hover:border-slate-700/80 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-xs text-slate-500 font-bold"># {index + 1}</span>
                          <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border capitalize ${
                            status === 'confirmed'
                              ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-400'
                              : status === 'cancelled'
                              ? 'bg-rose-950/30 border-rose-500/20 text-rose-500/70'
                              : 'bg-amber-950/50 border-amber-500/30 text-amber-400'
                          }`}>
                            {status}
                          </span>
                        </div>

                        <div className="flex gap-4 mb-4">
                          <img
                            src={mainImage}
                            alt="Property"
                            className="w-20 h-20 object-cover rounded-lg border border-slate-800 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-white text-sm truncate" title={property.propertyAddress}>
                              {property.propertyAddress || "Address not available"}
                            </h4>
                            <p className="text-slate-300 font-bold text-sm mt-1">
                              {property.propertyAmount ? formatCurrency(property.propertyAmount) : "N/A"}
                            </p>
                            <div className="flex gap-2 items-center mt-2">
                              <span className="text-[9px] bg-blue-500/20 text-blue-400 font-semibold px-2 py-0.5 rounded uppercase">
                                {property.propertyType || "N/A"}
                              </span>
                              <span className="text-[9px] bg-purple-500/20 text-purple-400 font-semibold px-2 py-0.5 rounded uppercase">
                                {property.propertyAdType || "Rent"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-slate-800/80 pt-4 flex justify-between items-center">
                          <div>
                            <p className="text-[10px] text-slate-500 font-semibold uppercase">Owner</p>
                            <p className="font-semibold text-slate-300 text-xs mt-0.5">
                              {owner.name || property.OwnerName || "Unknown Owner"}
                            </p>
                          </div>
                          
                          {status !== 'cancelled' ? (
                            <button
                              onClick={() => openCancelModal(booking)}
                              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer shadow-md"
                            >
                              Cancel Booking
                            </button>
                          ) : (
                            <button
                              disabled
                              className="px-4 py-2 bg-slate-800 text-slate-600 border border-slate-900 text-xs font-bold rounded-lg cursor-not-allowed opacity-50"
                            >
                              Cancelled
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

          </div>

        </div>

      </main>

      {/* Reusable premium Footer */}
      <Footer />

      {/* Cancellation Confirmation Dialog Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-[#0d1527] border border-slate-800 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl relative animate-scaleIn">
            
            {/* Modal Icon and Title */}
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center shrink-0 border border-rose-500/20">
                <svg className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Cancel Booking Request?</h3>
                <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">
                  Are you sure you want to cancel this booking? This request will be set to cancelled, and the property owner will be notified.
                </p>
              </div>
            </div>

            {/* Selected Property details inside confirmation modal */}
            {bookingToCancel && (
              <div className="bg-[#080d19] border border-slate-800 rounded-xl p-4 mb-6 text-sm flex gap-3 items-center">
                <img
                  src={bookingToCancel.propertyId?.propertyImages || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=150&q=80"}
                  alt="Property"
                  className="w-14 h-14 object-cover rounded-lg border border-slate-800 shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-bold text-white truncate" title={bookingToCancel.propertyId?.propertyAddress}>
                    {bookingToCancel.propertyId?.propertyAddress || "Address not available"}
                  </p>
                  <p className="text-slate-400 font-semibold text-xs mt-0.5">
                    Rent amount: {bookingToCancel.propertyId?.propertyAmount ? formatCurrency(bookingToCancel.propertyId.propertyAmount) : "N/A"}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={closeCancelModal}
                disabled={actionLoading}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleCancelBooking}
                disabled={actionLoading}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-800 text-white font-semibold text-sm rounded-lg transition-colors active:scale-95 cursor-pointer flex items-center gap-2"
              >
                {actionLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Cancelling...</span>
                  </>
                ) : (
                  'Cancel Booking'
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
