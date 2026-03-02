import VehicleRentalHome from './pages/Common/landing';
import Vehicles from './pages/Common/vehicles';
import About from './pages/Common/about';
import Contact from './pages/Common/contact';
import Login from './pages/Common/login';
import Signup from './pages/Common/signup';
import VehicleDetails from './pages/Common/vehicleDetails';
import Booking from './pages/Common/booking';
import Payment from './pages/Common/payment';
import Confirmation from './pages/Common/confirmation';
import OwnerDashboard from './pages/Owner/Dashboard';
import AddVehicle from './pages/Owner/AddVehicle';
import MyVehicles from './pages/Owner/MyVehicles';
import BookingRequests from './pages/Owner/BookingRequests';
import Drivers from './pages/Owner/Drivers';
import Earnings from './pages/Owner/Earnings';
import OwnerProfile from './pages/Owner/OwnerProfile';
import AdminDashboard from './pages/Admin/Dashboard';
import ManageUsers from './pages/Admin/ManageUsers';
import ManageOwners from './pages/Admin/ManageOwners';
import ManageVehicles from './pages/Admin/ManageVehicles';
import AllBookings from './pages/Admin/AllBookings';
import AdminProfile from './pages/Admin/Profile';
import UserHome from './pages/User/UserHome';
import BrowseVehicles from './pages/User/BrowseVehicles';
import MyBookings from './pages/User/MyBookings';
import PaymentHistory from './pages/User/PaymentHistory';
import UserProfile from './pages/User/UserProfile';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover />
      <Routes>
        <Route path="/" element={<VehicleRentalHome />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/vehicle/:id" element={<VehicleDetails />} />
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/payment/:id" element={<Payment />} />
        <Route path="/confirmation/:id" element={<Confirmation />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/owner/add-vehicle" element={<AddVehicle />} />
        <Route path="/owner/vehicles" element={<MyVehicles />} />
        <Route path="/owner/bookings" element={<BookingRequests />} />
        <Route path="/owner/drivers" element={<Drivers />} />
        <Route path="/owner/earnings" element={<Earnings />} />
        <Route path="/owner/profile" element={<OwnerProfile />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/owners" element={<ManageOwners />} />
        <Route path="/admin/vehicles" element={<ManageVehicles />} />
        <Route path="/admin/bookings" element={<AllBookings />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/user/home" element={<UserHome />} />
        <Route path="/user/vehicles" element={<BrowseVehicles />} />
        <Route path="/user/bookings" element={<MyBookings />} />
        <Route path="/user/payments" element={<PaymentHistory />} />
        <Route path="/user/profile" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
