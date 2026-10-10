import   { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import axios from 'axios';
import api from '../../../api.js';

// High-quality house images for the hero carousel
const carouselSlides = [
  {
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1600&h=700&q=80',
    title: 'Find Your Dream Rental Property',
    subtitle: 'Comfort, Convenience & Class — All in One Place',
  },
  {
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&h=700&q=80',
    title: 'Modern Villas in Premier Locations',
    subtitle: 'Immersive layouts designed with luxury and class',
  },
  {
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&h=700&q=80',
    title: 'Cozy Townhouses & Apartments',
    subtitle: 'Stay connected with the urban lifestyle you love',
  },
  {
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&h=700&q=80',
    title: 'Breathtaking Penthouses',
    subtitle: 'Stunning city skyline views from your rooftop terrace',
  },
];

 

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeFilter, setActiveFilter] = useState('All');
  const [Allproperties, setAllProperties] = useState([]);
  const[permissionStatus, setPermissionStatus]=useState(null);
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = JSON.parse(userStr);
  useEffect(()=>{
    const init=async()=>{
      if(!token || !user){
        alert("please Login to access your dashboard");
return;      }
    }
    init();
  },[token]);

  // Carousel Autoplay effect (cycles every 5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(()=>{
    const fetchAllProperties= async()=>{
      try {

        const response = await axios.get(`${api}/api/properties/properties/all`,{
          headers:{
            Authorization:  `Bearer ${token}`
          }
        });
          setAllProperties(response.data.properties);

        } catch (error) {
        console.error("Error fetching properties:", error);
      }
    }
    fetchAllProperties();
  },[]);

  // OwnerDetails
useEffect(()=>{
  const fetchOwnerDetails=async()=>{
    if(user){

      const response= await axios.get(`${api}/api/owner/ownerDetails/${user._id}`,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
       setPermissionStatus(response.data.owner.PermissionStatus);
    }
  }

  fetchOwnerDetails();
},[user]);

  const redirect= ()=>{
               if (userStr) {
                try {
                   if(user && user.type==="Owner"){
                    window.location.href = '/owner/home';

                  }
                    else if (user && user.type === 'Renter') {
                    window.location.href = '/renter/home';
                   }
                  else if (user && user.type === 'Admin') {
                    window.location.href = '/admin/home';
                  }else {
                    alert("Please log in as an Owner to access the dashboard.");
                  }
                } catch (err) {
                  console.error("Error parsing user data", err);
                  alert("An error occurred. Please try again.");
                }
              } else {
                alert("Please log in to access the dashboard.");
              }
  }

  // Filter properties
  const filteredProperties = activeFilter === 'All'
    ? Allproperties
    : Allproperties.filter(property => property.propertyType === activeFilter);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar ishome={true} />

      {/* Hero Carousel Section */}
      <div className="relative h-[420px] md:h-[500px] lg:h-[580px] overflow-hidden w-full group">
        {/* Slides */}
        {carouselSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image Overlay with dark gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/70 z-10"></div>
            <div className="absolute inset-0 bg-black/30 z-10"></div>
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover transform scale-100 transition-transform duration-10000 ease-out"
            />
            {/* Slide Content Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 px-4 mt-8">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-md max-w-4xl leading-tight">
                {slide.title}
              </h1>
              <p className="mt-4 text-base md:text-lg lg:text-xl text-slate-200 max-w-2xl font-light drop-shadow-sm">
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}
  
        {/* Carousel Pagination Dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentSlide
                  ? 'bg-indigo-500 scale-125 shadow-lg shadow-indigo-500/50'
                  : 'bg-slate-400/60 hover:bg-slate-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      {/* Main Showcase Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 flex-1 w-full">
        {/* Section Header */}
    {token && (
    <div className="flex justify-center mb-10">

      {
       user.type==="Owner" && permissionStatus  === "Ungrant" ? 
          <button
            className="px-6 py-3 rounded-md bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 font-medium transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl"
            onClick={() => {alert('Wait for Approval')}}
          >
            Permission Not Granted
          </button>
          :
           <button
            className="px-6 py-3 rounded-md bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 font-medium transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl"
            onClick={() => redirect()}
          >
            Go To Your Dashboard
          </button>
                }

        </div>

    )}

        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Explore Our Premium Properties
          </h2>
          <p className="mt-4 text-slate-400 text-sm md:text-base font-medium flex items-center justify-center flex-wrap gap-2">
            Looking to post your property?
            <Link
              to="/auth/register"
              className="border border-indigo-500/50 hover:bg-indigo-600/10 text-indigo-400 py-1.5 px-4 rounded-md text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-indigo-500/10"
            >
              Register as Owner
            </Link>
          </p>
        </div>

        {/* Filtering Tabs */}
        <div className="flex justify-center flex-wrap gap-2.5 mb-12 md:mb-16">
          {['All', 'Apartment', 'Villa', 'House', 'Penthouse','Commercial'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer border ${
                activeFilter === filter
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/25 scale-105'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-800/80'
              }`}
            >
              {filter}s{filter === 'All' ? ' \u2022 View All' : ''}
            </button>
          ))}
        </div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {filteredProperties.map((property) => (
              <div
                key={property._id}
                className="group flex flex-col bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-700/60 hover:shadow-indigo-950/20"
              >
                {/* Property Image Container */}
                <div className="relative h-56 md:h-64 overflow-hidden w-full">
                  <img
                    src={property.propertyImages}
                    alt={'img'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  {/* Property Amount Overlay Badge */}
                  <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-slate-800 text-indigo-400 font-bold text-base z-10">
                    ${property.propertyAmount.toLocaleString()}
                  </div>
                  {/* Property Type Badge */}
                  <div className="absolute top-4 right-4 bg-indigo-600/90 text-white text-xs font-semibold px-3 py-1 rounded-md uppercase tracking-wider z-10 shadow-md">
                    {property.propertyType}
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Location Badge */}
                    <div className="flex items-center text-slate-400 text-xs gap-1.5 mb-2 font-medium">
                      <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {property.propertyAddress}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">
                      {property.propertyAdType}
                    </h3>

                    {/* Specs / Description */}
                    <p className="text-slate-400 text-sm leading-relaxed mb-6 font-normal">
                      {property.additionalDetails}
                    </p>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <div>
                      <span>Owner: </span>
                      <span className="text-slate-300 font-semibold">{property.OwnerName}</span>
                    </div>
                    <button className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 transition-colors cursor-pointer group/btn">
                      View Details
                      <svg className="w-3.5 h-3.5 transform group-hover/btn:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-900/20 border border-slate-900 border-dashed rounded-2xl">
            <svg className="w-12 h-12 mx-auto text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="text-lg font-bold text-white">No properties found</h3>
            <p className="text-slate-500 text-sm mt-1">Try selecting a different filter option above.</p>
          </div>
        )}
      </div>

      

      {/* Premium Footer */}
       <Footer />
    </div>
  );
}