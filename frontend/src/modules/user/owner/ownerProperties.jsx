import  { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../../../api.js' ;
 
export default function OwnerProperties() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
 
  // Properties List State with Sample Data
  const [properties, setProperties] = useState([]);
 //fetching bookings for owner
 
  // Route Protection & Loading User Data + Fetch Properties
  useEffect(() => {
    const initializeUser = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (!storedToken || !storedUser) {
        alert('Access Denied. Please login first.');
        window.location.href = '/auth/login';
        return;
      }

      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.type !== 'Owner') {
          alert('Access Denied. Owner access only.');
          window.location.href = '/';
          return;
        }

        // Set user and token state
        setUser(parsedUser);
        setToken(storedToken);

        // Fetch properties after setting state
        try {
          const response = await axios.get(`${api}/api/owner/myProperties/${parsedUser._id}`, {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          });
           setProperties(response.data.properties);
        } catch (error) {
          console.error("Error fetching properties:", error.message);
          alert('Error fetching properties. Please try again later.');
         }
      } catch (err) {
        console.error('Error parsing user data', err);
        window.location.href = '/auth/login';
      }
    };

    initializeUser();
  }, []);

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [editFormData, setEditFormData] = useState({
    propertyType: '',
    propertyAdType: '',
    propertyAddress: '',
    ownerContact: '',
    propertyAmount: 0,
    availability:Boolean,
    additionalDetails: '',
  });

  // Delete Confirmation Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePropertyId, setDeletePropertyId] = useState(null);

 
   
  // Submit Handler
  
 
  // Open Edit Modal
  const openEditModal = (property) => {
    setEditingProperty(property);
    setEditFormData({
      propertyType: property.propertyType,
      propertyAdType: property.propertyAdType,
      propertyAddress: property.propertyAddress,
      ownerContact: property.ownerContact,
      propertyAmount: property.propertyAmount,
      additionalDetails: property.additionalDetails,
      availability:property.availability
    });
     setShowEditModal(true);
  };

  // Close Edit Modal
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingProperty(null);
  };

  // Handle Edit Form Changes
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: name === 'propertyAmount' ? Number(value) : value,
    }));
  };

  // Save Edited Property
  const saveEditedProperty = async () => {
    if (!editFormData.propertyAddress.trim()) {
      alert('Property address is required.');
      return;
    }
    if (!editFormData.ownerContact.trim()) {
      alert('Owner contact is required.');
      return;
    }
    if (editFormData.propertyAmount <= 0) {
      alert('Property amount must be greater than 0.');
      return;
    }

    // Update property in the list
       await axios.put(`${api}/api/owner/updateProperty/${editingProperty._id}`, editFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Property details updated successfully");
    setShowEditModal(false);
    setEditingProperty(null);
    window.location.reload();
  };

  // Open Delete Confirmation Modal
  const openDeleteModal = (propertyId) => {
    setDeletePropertyId(propertyId);
    setShowDeleteModal(true);
  };

  // Close Delete Confirmation Modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletePropertyId(null);
  };

  // Delete Property
  const deleteProperty = async () => {
    await axios.delete(`${api}/api/owner/deleteProperty/${deletePropertyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    alert("Property deleted successfully");
    setShowDeleteModal(false);
    setDeletePropertyId(null);
    window.location.reload();
  };


  
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="animate-spin h-10 w-10 border-t-2 border-indigo-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div >
         <title>OwnerHome - RentHub</title>


 
            <div className="w-full">
              {/* Properties Table */}
              <div className="overflow-x-auto -mx-4 sm:mx-0 sm:overflow-visible">
                {properties.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 text-center px-4">
                    <svg className="w-12 h-12 sm:w-16 sm:h-16 text-slate-500 mb-4 sm:mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">No Properties Found</h3>
                    <p className="text-slate-400 text-xs sm:text-sm">Start by adding a new property to see them listed here.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#5969f6]/20 border-b border-slate-700">
                        <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#5969f6]">ID</th>
                        <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#5969f6] hidden sm:table-cell">Type</th>
                        <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#5969f6] hidden md:table-cell">Ad Type</th>
                        <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#5969f6]">Address</th>
                        <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#5969f6] hidden lg:table-cell">Contact</th>
                        <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#5969f6]">Amount</th>
                        <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#5969f6] hidden sm:table-cell">Status</th>
                        <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-bold text-[#5969f6]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.map((property) => (
                        <tr
                          key={property._id}
                          className="border-b border-slate-700/50 hover:bg-slate-900/30 transition-colors duration-150"
                        >
                          <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-300 font-mono truncate max-w-[60px] sm:max-w-xs" title={property._id}>
                            {property._id }
                          </td>
                          <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-300 capitalize hidden sm:table-cell">
                            {property.propertyType }
                          </td>
                          <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-300 capitalize hidden md:table-cell">
                            {property.propertyAdType}
                          </td>
                          <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-300 max-w-[80px] sm:max-w-xs truncate" title={property.propertyAddress}>
                            {property.propertyAddress}
                          </td>
                          <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-300 hidden lg:table-cell">
                            {property.ownerContact}
                          </td>
                          <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-300 font-semibold">
                            ₹{(property.propertyAmount / 100000).toFixed(1)}L
                          </td>
                          <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm hidden sm:table-cell">
                          {property.availability ? (
                            <span className="px-2 sm:px-3 py-1 bg-emerald-600/30 text-emerald-400 text-xs font-semibold rounded-full">
                              Available
                            </span>
                          ) : (
                            <span className="px-2 sm:px-3 py-1 bg-rose-600/30 text-rose-400 text-xs font-semibold rounded-full">
                              Not Availble
                            </span>
                          )}
                          </td>
                          <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center">
                            <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
                              <button
                                onClick={() => openEditModal(property)}
                                className="px-2 sm:px-4 py-1.5 bg-[#5969f6] hover:bg-[#4958df] text-white text-xs font-semibold rounded-lg transition-all duration-200 active:scale-95 cursor-pointer whitespace-nowrap"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => openDeleteModal(property._id)}
                                className="px-2 sm:px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-all duration-200 active:scale-95 cursor-pointer whitespace-nowrap"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                )}
              </div>

              {/* Edit Modal */}
              {showEditModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
                  <div className="bg-[#0d1527] border border-slate-700 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 max-w-xs sm:max-w-xl md:max-w-2xl w-full max-h-[85vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl">
                    {/* Modal Header */}
                    <div className="flex justify-between items-center mb-4 sm:mb-6">
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#5969f6]">Edit Property</h2>
                      <button
                        onClick={closeEditModal}
                        className="text-slate-400 hover:text-white transition-colors p-1"
                      >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Modal Form */}
                    <form className="space-y-4 sm:space-y-6">
                      {/* Property Type */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="flex flex-col">
                          <label className="text-slate-300 font-semibold text-xs sm:text-sm mb-2">
                            Property Type
                          </label>
                          <div className="relative">
                            <select
                              name="propertyType"
                              value={editFormData.propertyType}
                              onChange={handleEditFormChange}
                              className="w-full bg-[#182035] border border-slate-700 rounded-lg py-2 sm:py-3 px-3 sm:px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer text-xs sm:text-sm"
                            >
                              <option value="Residential">Residential</option>
                              <option value="Commercial">Commercial</option>
                              <option value="Apartment">Apartment</option>
                              <option value="Villa">Villa</option>
                              <option value="House">House</option>
                              <option value="Penthouse">Penthouse</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 sm:px-4 text-slate-400">
                              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Ad Type */}
                        <div className="flex flex-col">
                          <label className="text-slate-300 font-semibold text-xs sm:text-sm mb-2">
                            Ad Type
                          </label>
                          <div className="relative">
                            <select
                              name="propertyAdType"
                              value={editFormData.propertyAdType}
                              onChange={handleEditFormChange}
                              className="w-full bg-[#182035] border border-slate-700 rounded-lg py-2 sm:py-3 px-3 sm:px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer text-xs sm:text-sm"
                            >
                              <option value="Rent">Rent</option>
                              <option value="Sale">Sale</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 sm:px-4 text-slate-400">
                              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Address */}
                      <div className="flex flex-col">
                        <label className="text-slate-300 font-semibold text-xs sm:text-sm mb-2">
                          Property Address
                        </label>
                        <input
                          type="text"
                          name="propertyAddress"
                          value={editFormData.propertyAddress}
                          onChange={handleEditFormChange}
                          className="w-full bg-[#182035] border border-slate-700 rounded-lg py-2 sm:py-3 px-3 sm:px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-xs sm:text-sm"
                        />
                      </div>

                      {/* Contact and Amount Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="flex flex-col">
                          <label className="text-slate-300 font-semibold text-xs sm:text-sm mb-2">
                            Owner Contact
                          </label>
                          <input
                            type="text"
                            name="ownerContact"
                            value={editFormData.ownerContact}
                            onChange={handleEditFormChange}
                            className="w-full bg-[#182035] border border-slate-700 rounded-lg py-2 sm:py-3 px-3 sm:px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-xs sm:text-sm"
                          />
                        </div>

                        <div className="flex flex-col">
                          <label className="text-slate-300 font-semibold text-xs sm:text-sm mb-2">
                            Amount
                          </label>
                          <input
                            type="number"
                            name="propertyAmount"
                            value={editFormData.propertyAmount}
                            onChange={handleEditFormChange}
                            className="w-full bg-[#182035] border border-slate-700 rounded-lg py-2 sm:py-3 px-3 sm:px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-xs sm:text-sm"
                          />
                        </div>
                      </div>

                      {/* Additional Details */}
                      <div className="flex flex-col">
                        <label className="text-slate-300 font-semibold text-xs sm:text-sm mb-2">
                          Additional Details
                        </label>
                        <textarea
                          name="additionalDetails"
                          value={editFormData.additionalDetails}
                          onChange={handleEditFormChange}
                          rows="3"
                          className="w-full bg-[#182035] border border-slate-700 rounded-lg py-2 sm:py-3 px-3 sm:px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-xs sm:text-sm resize-none"
                        ></textarea>
                      </div>

                      {/* Availability Dropdown */}
                        <div className="flex flex-col">
                    <label className="text-slate-300 font-semibold text-xs sm:text-sm mb-2">
                     Availability
                    </label>
                    <div className="relative">
                      <select
                        name="availability"
                        value={editFormData.availability}
                        onChange={handleEditFormChange}
                        className="w-full bg-[#182035] border border-slate-800 rounded-lg py-2 sm:py-3 px-3 sm:px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer text-xs sm:text-sm"
                      >
                        <option value={true}>Available</option>
                        <option value={false}>Not Available</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 sm:px-4 text-slate-400">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                      {/* Modal Actions */}
                      <div className="flex gap-2 sm:gap-3 justify-end mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-700">
                        <button
                          type="button"
                          onClick={closeEditModal}
                          className="px-4 sm:px-6 py-2 sm:py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs sm:text-sm rounded-lg transition-all duration-200 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={saveEditedProperty}
                          className="px-4 sm:px-6 py-2 sm:py-2.5 bg-[#5969f6] hover:bg-[#4958df] text-white font-semibold text-xs sm:text-sm rounded-lg transition-all duration-200 active:scale-95 cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Delete Confirmation Modal */}
              {showDeleteModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
                  <div className="bg-[#0d1527] border border-slate-700 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 max-w-xs sm:max-w-md w-full shadow-2xl">
                    {/* Modal Header */}
                    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rose-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2M9 5a9 9 0 1118 0 9 9 0 01-18 0z" />
                        </svg>
                      </div>
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Delete Property?</h2>
                    </div>

                    {/* Modal Body */}
                    <p className="text-slate-400 text-xs sm:text-sm md:text-base mb-6 sm:mb-8">
                      Are you sure you want to delete this property? This action cannot be undone.
                    </p>

                    {/* Modal Actions */}
                    <div className="flex gap-2 sm:gap-3 justify-end">
                      <button
                        onClick={closeDeleteModal}
                        className="px-4 sm:px-6 py-2 sm:py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs sm:text-sm rounded-lg transition-all duration-200 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={deleteProperty}
                        className="px-4 sm:px-6 py-2 sm:py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm rounded-lg transition-all duration-200 active:scale-95 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
           </div>
   
  );
}
