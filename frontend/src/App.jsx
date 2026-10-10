import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './modules/common/Home.jsx';
import Register from './modules/common/Register.jsx';
import Login from './modules/common/Login.jsx';
import OwnerHome from './modules/user/owner/OwnerHome.jsx';
import UserHome from './modules/user/renter/UserHome.jsx';
import AllProperties from './modules/user/renter/AllProperties.jsx';
import UserBookings from './modules/user/renter/UserBookings.jsx';
import AdminHome from './modules/user/admin/adminHome.jsx';
function App() {
  return (
    <Router>
    <div className="min-h-screen bg-slate-950 select-none">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="auth/register" element={<Register />} />
        <Route path="auth/login" element={<Login />} />
        <Route path="/owner/home" element={<OwnerHome />} />
        <Route path="/renter/home" element={<UserHome />} />
        <Route path="/renter/all-properties" element={<AllProperties />} />
        <Route path="/renter/bookings" element={<UserBookings />} />
        <Route path="/admin/home" element={<AdminHome />} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;
