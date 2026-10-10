import  { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../../../api.js' ;
import Navbar from '../../../components/Navbar.jsx';
import AdminAllProperties from './adminAllProperties.jsx';
import AdminAllBookings from './adminAllBookings.jsx'
 
export default function AdminHome() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [activeTab, setActiveTab] = useState('All Users'); // Default active tab
  

    const [AllUsers, setAllUsers]=useState([])
// fetching all users.
    useEffect(()=>{
    const init=()=>{
  const token= localStorage.getItem('token');
      const user=localStorage.getItem('user');
      if(!user ||  !token){
          window.location.href='/auth/login';
          return;
      }

      setToken(token);
      setUser(user);

          const  fetchAllUsers= async()=>{
        const response = await axios.get(`${api}/api/admin/getallusers`,{
          headers:{
            Authorization:`Bearer ${token}`
          }
        });
        setAllUsers(response.data.users)
       }
      fetchAllUsers();  
    }
    init();
    },[token]);

const deleteUser= async(UserId)=>{
  const res=confirm("Are You Sure?")
  if(!res) return;
  await axios.delete(`${api}/api/admin/user/deleteUser/${UserId}`,
    {
      headers:{
        Authorization: `Bearer ${token}`
      }
    }
  );
 alert('user Deleted SuccessFully');
 window.location.reload();

}

const changePermission= async(userId, PermissionStatus)=>{
 
  const response= await axios.put(`${api}/api/admin/user/updatePermissionStatus`,{userId, PermissionStatus},{
    headers:{
      Authorization: `Bearer ${token}`
    }
  })
 
  if(response.status===200) window.location.reload();
 }
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="animate-spin h-10 w-10 border-t-2 border-indigo-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080d19] text-white flex flex-col font-sans selection:bg-indigo-500 selection:text-white pb-12">
     <Navbar user={user}  />
        <title>Admin Home - RentHub</title>

      {/* Tabs Selector Bar */}
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 mt-4">
        <div className="flex gap-8 border-b border-slate-800/80 pb-3">
          {['All Users', 'All Properties', 'All Bookings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative font-semibold text-sm transition-all duration-200 pb-3 -mb-3 cursor-pointer ${
                activeTab === tab
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
     <main className="max-w-7xl mx-auto w-full px-6 md:px-12 mt-6 flex-1">
        {/* Conditional Rendering of Tabs Content */}
        {activeTab === 'All Users' && (
          <div>
           <div className="overflow-x-auto">
                {AllUsers.length === 0 ? (
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
                        <th className="px-6 py-4 text-left text-sm font-bold text-[#5969f6]">User ID</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-[#5969f6]">User Name</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-[#5969f6]">Email</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-[#5969f6]">Type</th>
                        <th className="px-6 py-4 text-center text-sm font-bold text-[#5969f6]">Presnet <br /><small>Permission</small> </th>
                         <th className="px-6 py-4 text-center text-sm font-bold text-[#5969f6]">Update To</th>
                        <th className="px-6 py-4 text-center text-sm font-bold text-[#5969f6]">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {AllUsers.map((users) => (
                        <tr
                          key={users._id}
                          className="border-b border-slate-700/50 hover:bg-slate-900/30 transition-colors duration-150"
                        >

                          <td className="px-6 py-4 text-sm text-slate-300 font-mono truncate max-w-xs" title={users._id}>
                            {users._id}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-300 font-mono truncate max-w-xs" title={users.name}>
                            {users.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-300 capitalize">
                            {users.email}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-300 capitalize">
                            {users.type
                            
                            
                            }
                          </td>
                         <td className="px-6 py-4 text-sm text-slate-300 capitalize">
                            {users.PermissionStatus
                            
                            }
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-300">
                           {users.type==="Owner" ? (

                            users.PermissionStatus==="Ungrant"  
                            ? <button
                              className='bg-green-800 w-19 h-6 text-sm hover:cursor-pointer rounded-lg'
                              onClick={()=>changePermission(users._id,"Granted")}
                            
                            > To Granted</button>
                           
                           :  <button
                            className='bg-red-800 w-19 h-6 text-sm hover:cursor-pointer rounded-lg'
                            onClick={()=>changePermission(users._id,"Ungrant")}

                           
                           >To UnGrant</button>
                           
                           ) :(
                            <p>NA</p>
                           )

                           }
                          </td>

                          

                            
                          <td className="px-6 py-4 text-sm text-slate-300">
                           <button 
                           className='bg-red-800 w-19 h-6 text-sm hover:cursor-pointer rounded-lg'
                           onClick={()=>{deleteUser(users._id)}}
                           >Delete</button>
                          
                        </td>
                       
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
          </div>
        )}
        {activeTab === 'All Properties' && (
          <div>
            <AdminAllProperties/>
          </div>
        )}

          {activeTab === 'All Bookings' && (
          <div>
            <AdminAllBookings/>
          </div>
        )}
         
        
    </main>
    </div>
  )}
