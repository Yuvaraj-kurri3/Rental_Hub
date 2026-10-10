import  { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../../../api.js' ;
  
export default function OwnerBookings() {
  // Properties List State with Sample Data
const [Bookingproperties, setBookingProperties] = useState([]);
const [token,setToken]=useState();
const [user,setUser]=useState();
 

 
//fetching bookings for owner
useEffect(()=>{
    const initailazation=async()=>{

          const token = localStorage.getItem('token');
      const userString = localStorage.getItem('user');
      const user = JSON.parse(userString); // Parse the user object
      if(!token || !user){
        alert('login to access your details');
        return window.location.href='/auth/login';
      }
      setToken(token);
      setUser(user);

 const fetchBookings= async()=>{
     try {
       const response= await axios.get(`${api}/api/booking/owner-bookings/${user._id}`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
 
      // Transform the bookings data to match the UI structure
      const transformedBookings = response.data.bookings.map(booking => ({
        bookingid: booking._id,
        propertyId: booking.propertyId._id,
        tenantName: booking.userId?.name || booking.tenantName,
        tenantPhone: booking.phoneNumber,
        bookinstatus: booking.bookingStatus
      }));

      setBookingProperties(transformedBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error.message);
    }
  };
  if(user && token) fetchBookings();
    }
 initailazation();
},[]);

 

  const handleBookingStatusChange= async(propertyId, newStatus)=>{
 
    try{

        const response= await axios.put(`${api}/api/owner/bookings/status/${propertyId}`,{
            bookingStatus: newStatus
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
         if(response.status===200) {

           alert("Booking status updated successfully");
          window.location.reload();

         }
 
    }
    catch(error){
      console.error("Error updating booking status:", error);
      alert("Error updating booking status. Please try again.");
    }
  }
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="animate-spin h-10 w-10 border-t-2 border-indigo-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div>
         <div className="w-full">
              {/* Properties Table */}
              <div className="overflow-x-auto">
                {Bookingproperties.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <svg className="w-16 h-16 text-slate-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <h3 className="text-xl font-bold text-white mb-2">No Properties Found</h3>
                    <p className="text-slate-400 text-sm">Start by adding a new property to see them listed here.</p>
                  </div>
                ) : (
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#5969f6]/20 border-b border-slate-700">
                        <th className="px-6 py-4 text-left text-sm font-bold text-[#5969f6]">Booking ID</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-[#5969f6]">Property ID</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-[#5969f6]">Tenant Name</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-[#5969f6]">Tenant Phone</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-[#5969f6]">Booking Status</th>
                        <th className="px-6 py-4 text-center text-sm font-bold text-[#5969f6]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Bookingproperties.map((property) => (
                        <tr
                          key={property.bookingid}
                          className="border-b border-slate-700/50 hover:bg-slate-900/30 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 text-sm text-slate-300 font-mono truncate max-w-xs" title={property.bookingid}>
                            {property.bookingid}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-300 capitalize">
                            {property.propertyId}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-300 capitalize">
                            {property.tenantName}
                          </td>
                         
                          <td className="px-6 py-4 text-sm text-slate-300">
                            {property.tenantPhone}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-300">
                            {property.bookinstatus}
                          </td>
                          {property.bookinstatus === 'pending' ? (
                            <td className="px-6 py-4 text-large text-slate-300 font-semibold">
                              <button 
                              className="bg-[#00FF1E] hover:bg-[#4a58d6] text-white py-2 px-4 rounded-md transition-colors duration-150"
                              onClick={() => handleBookingStatusChange(property.bookingid, 'confirmed')}
                              >
                                Mark as confirmed
                              </button>
                            </td>
                          ) : (
                            <td className="px-6 py-4 text-large text-slate-300 font-semibold">
                              <button 
                              className="bg-[#E6E620] hover:bg-[#4a58d6] text-green-300 py-2 px-4 rounded-md transition-colors duration-150"
                              
                              onClick={()=> handleBookingStatusChange(property.bookingid, 'pending')}
                              >
                                Mark as Pending
                              </button>
                            </td>
                          )}
                       
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>


            </div>
          
        </div>
     
     
   
  );
}
