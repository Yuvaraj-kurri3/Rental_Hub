import  { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../../../api.js' ;
 
 
export default function AdminAllProperties() {


  // Properties List State with Sample Data
     const [Allproperties, setAllproperties] = useState([]);
      const user=localStorage.getItem('user')
      const token=localStorage.getItem('token');

   useEffect(()=>{
    const init=async()=>{
      if(!token || !user){
        alert("please Login to access your dashboard");
        window.location.href='/auth/login';
      }
     }
    init();
  });



useEffect(()=>{
const getAllProperties=async()=>{
  try {
     const response =await axios.get(`${api}/api/admin/properties/getAllProperties`,{
          headers:{
            Authorization:`Bearer ${token}`
          }
        });
    
    setAllproperties(response.data.properties);
  } catch (error) {
    console.error(error.message);
  }
}
getAllProperties();
},[]);

     
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="animate-spin h-10 w-10 border-t-2 border-indigo-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080d19] text-white flex flex-col font-sans selection:bg-indigo-500 selection:text-white pb-12">
    
        <title>OwnerHome - RentHub</title>

      {/* Main Content Area Container */}
     <main className="max-w-7xl mx-auto w-full px-6 md:px-12 mt-6 flex-1">
        {/* Conditional Rendering of Tabs Content */}
        {  (
          <div>
           <div className="overflow-x-auto">
                {Allproperties.length === 0 ? (
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
                        <th className="px-6 py-4 text-left text-sm font-bold text-[#5969f6]">Property ID</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-[#5969f6]">Owner ID</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-[#5969f6]">Property Type</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-[#5969f6]">Property Ad Type</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-[#5969f6]">Propert Address</th>
                        <th className="px-6 py-4 text-center text-sm font-bold text-[#5969f6]">Owner Contact</th>
                        <th className="px-6 py-4 text-center text-sm font-bold text-[#5969f6]">Property Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Allproperties.map((property) => (
                        <tr
                          key={property._id}
                          className="border-b border-slate-700/50 hover:bg-slate-900/30 transition-colors duration-150"
                        >
                             <td className="px-6 py-4 text-sm text-slate-300 font-mono truncate max-w-xs"  >
                            {property._id}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-300 font-mono truncate max-w-xs"  >
                            {property.ownerId}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-300 font-mono truncate max-w-xs"  >
                            {property.propertyType}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-300 capitalize">
                            {property.propertyAdType}

                          </td>
                          <td className="px-6 py-4 text-sm text-slate-300 capitalize">
                            {property.propertyAddress}

                          </td>
                         
                          <td className="px-6 py-4 text-sm text-slate-300">
                            
                        {property.ownerContact}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-300">
                            {property.propertyAmount}

                           </td>
                        
                       
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
          </div>
        )}
         
         
        
    </main>
    </div>
  )}
