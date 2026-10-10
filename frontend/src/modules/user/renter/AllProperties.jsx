import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import axios from 'axios';
import api from '../../../../api.js';



const propertyTypeOptions = [
  'All Properties',
  'Villa',
  'Apartment',
  'House',
  'Flat',
  'Commercial',
  'Land',
];

const fallbackPropertyImage =
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';

export default function AllProperties() {
  const [selectedType, setSelectedType] = useState('All Properties');
  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  // Handle filter change
  useEffect(() => {
    const setType = () => {
      if (selectedType === 'All Properties') {
        setFilteredProperties(allProperties);
      } else {
        setFilteredProperties(
          allProperties.filter((prop) => prop.propertyType === selectedType)
        );
      }
    }
    setType();
  }, [selectedType, allProperties]);

// login verifcation
  useEffect(() => {
    const init = async () => {
      if (!token || !user) {
        alert("please Login to access your dashboard");
        window.location.href = '/auth/login';
      }
    }
    init();
  });
  // Fetch all properties from backend on component mount
  useEffect(() => {
    const fetchAllProperties = async () => {
      try {
        const response = await axios.get(`${api}/api/properties/properties/all`,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAllProperties(response.data.properties);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    }
    fetchAllProperties();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Handle book/buy button click
  const handleActionClick = async (property) => {
    if (!token) {
      alert('Please login to proceed with booking');
      navigate('/auth/login');
      return;
    }
    const userr = JSON.parse(user);
    if (!userr || !['RENTER', 'USER'].includes(userr.role?.toUpperCase())) {
      alert('Only renter accounts can book or purchase properties. Please sign in with a renter account.');
      return;
    }

    try {
      const response = await axios.post(`${api}/api/booking/properties/book/${property._id}/${userr._id}`, {},{
        headers: {
          authorization: `Bearer ${token}`
        }
      });

      alert(response.data.message);

      setTimeout(() => { window.location.reload(); }, 500);
      // Optionally, navigate to a booking confirmation page or refresh the properties list

    } catch (error) {
      console.error("Error during booking/purchase:", error);
      alert(
        error.response?.data?.message ||
          (error.response?.status === 403
            ? 'Your account is not authorized to book this property. Please sign in with your renter account.'
            : 'An error occurred. Please try again later.')
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      <title>All Properties - RentHub</title>

      {/* Header Section */}
      <section className="relative overflow-hidden pt-8 pb-12 md:pt-12 md:pb-16 px-4 sm:px-6 lg:px-8">
        {/* Background gradient */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Explore Properties
              </span>
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Browse available rental and sale properties from verified owners.
            </p>
          </div>

          {/* Filter Section */}
          <div className="max-w-md mx-auto">
            <label className="block text-sm font-semibold text-slate-300 mb-3">
              Property Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800/70 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer font-medium"
            >
              {propertyTypeOptions.map((type) => (
                <option key={type} value={type} className="bg-slate-900">
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Properties Grid Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {filteredProperties.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-6xl mb-4 opacity-50">🏠</div>
              <h3 className="text-2xl font-bold text-slate-300 mb-2">No properties found</h3>
              <p className="text-slate-400 text-center max-w-md">
                No properties found for the selected category. Try selecting a different type.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProperties.map((property) => (
                <div
                  key={property._id}
                  className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 hover:scale-105 transform flex flex-col h-full"
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden h-48 md:h-56 bg-slate-700">
                    <img
                      src={property.propertyImages || fallbackPropertyImage}
                      alt={property.propertyType}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                      {/* Property Type Badge */}
                      <span className="bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
                        {property.propertyType}
                      </span>

                      {/* Ad Type Badge */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${property.propertyAdType === 'Rent'
                          ? 'bg-gradient-to-r from-purple-500 to-purple-600'
                          : 'bg-gradient-to-r from-amber-500 to-amber-600'
                          }`}
                      >
                        {property.propertyAdType}
                      </span>
                    </div>

                    {/* Availability Badge */}
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${property.availability
                          ? 'bg-emerald-500/90 text-white'
                          : 'bg-red-500/90 text-white'
                          }`}
                      >
                        {property.availability ? 'Available' : 'Not Available'}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="flex-1 p-5 flex flex-col">
                    {/* Address */}
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                      {property.propertyAddress}
                    </h3>

                    {/* Price */}
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
                      {formatCurrency(property.propertyAmount)}
                    </div>

                    {/* Details Grid */}
                    <div className="space-y-3 mb-4 flex-1">
                      {/* Owner Name */}
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
                        </svg>
                        <div>
                          <p className="text-xs text-slate-400">Owner</p>
                          <p className="text-sm font-semibold text-slate-200">{property.OwnerName}</p>
                        </div>
                      </div>

                      {/* Contact */}
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773c.182.479.456 1.04.782 1.57.327.53.751 1.042 1.272 1.44.52.398 1.125.645 1.579.645.453 0 1.06-.247 1.579-.645.52-.398.945-.91 1.272-1.44.326-.53.6-1.091.782-1.57l-1.548-.773a1 1 0 01-.54-1.06l.74-4.435A1 1 0 0114.847 3H17a1 1 0 011 1v5a2 2 0 01-2 2v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a2 2 0 01-2-2V3z"></path>
                        </svg>
                        <div>
                          <p className="text-xs text-slate-400">Contact</p>
                          <p className="text-sm font-semibold text-slate-200">{property.ownerContact}</p>
                        </div>
                      </div>

                      {/* Additional Details */}
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0L10 9.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                        <div className="flex-1">
                          <p className="text-xs text-slate-400">Details</p>
                          <p className="text-sm text-slate-300 line-clamp-2">{property.additionalDetails}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleActionClick(property)}
                      disabled={!property.availability}
                      className={`w-full py-2.5 px-4 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 ${property.availability
                        ? property.propertyAdType === 'Rent'
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-blue-500/50 text-white'
                          : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg hover:shadow-amber-500/50 text-white'
                        : 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-50'
                        }`}
                    >
                      {!property.availability
                        ? 'Not Available'
                        : property.propertyAdType === 'Rent'
                          ? 'Book Now'
                          : 'Buy Now'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Statistics Section */}
      {allProperties.length > 0 && (
        <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-slate-800/30 border-t border-slate-700/50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
                  {allProperties.length}
                </div>
                <p className="text-slate-400 text-sm">Properties Found</p>
              </div>

              <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent mb-2">
                  {allProperties.filter((p) => p.availability).length}
                </div>
                <p className="text-slate-400 text-sm">Available</p>
              </div>

              <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent mb-2">
                  {allProperties.filter((p) => p.propertyAdType === 'Rent').length}
                </div>
                <p className="text-slate-400 text-sm">For Rent</p>
              </div>

              <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <div className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent mb-2">
                  {allProperties.filter((p) => p.propertyAdType === 'Sale').length}
                </div>
                <p className="text-slate-400 text-sm">For Sale</p>
              </div>
            </div>
          </div>
        </section>
      )}
      <Footer />
    </div>
  );
}
