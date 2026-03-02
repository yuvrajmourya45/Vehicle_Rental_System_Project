import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import bannerCar from "../../CarRental-assets/assets/banner_car_image.png";

function VehicleRentalHome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar />

      <section className="relative h-[600px] bg-cover bg-center flex items-center justify-center text-white" style={{ backgroundImage: `url(${bannerCar})` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40"></div>
        <div className="relative text-center max-w-4xl px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">
            Rent Your <span className="text-blue-400">Dream</span> Vehicle
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100">Choose from cars, bikes, buses & trucks at affordable prices</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => navigate('/vehicles')} className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg">
              Browse Vehicles
            </button>
            <button onClick={() => navigate('/signup')} className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg">
              Get Started
            </button>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-12 max-w-6xl mx-auto">
        <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-800">Browse by Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Cars', icon: '🚗' },
            { name: 'Bikes', icon: '🏍️' },
            { name: 'Buses', icon: '🚌' },
            { name: 'Trucks', icon: '🚚' }
          ].map((category) => (
            <div key={category.name} onClick={() => navigate('/vehicles')} className="bg-white rounded-lg shadow-md p-6 text-center cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all border border-gray-100">
              <div className="text-5xl mb-3">{category.icon}</div>
              <h4 className="text-lg font-bold text-gray-800">{category.name}</h4>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-12 px-6 md:px-12">
        <h3 className="text-2xl md:text-3xl font-bold text-center mb-3 text-gray-800">How It Works</h3>
        <p className="text-center text-gray-600 mb-10">Rent a vehicle in 3 simple steps</p>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl">🚗</span>
            </div>
            <h4 className="font-bold text-lg mb-2 text-gray-800">Choose Your Vehicle</h4>
            <p className="text-sm text-gray-600">Browse our wide selection of vehicles</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl">📅</span>
            </div>
            <h4 className="font-bold text-lg mb-2 text-gray-800">Book Instantly</h4>
            <p className="text-sm text-gray-600">Select dates and confirm booking</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl">💳</span>
            </div>
            <h4 className="font-bold text-lg mb-2 text-gray-800">Pay Securely</h4>
            <p className="text-sm text-gray-600">Complete payment safely online</p>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-12">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-10 text-center shadow-xl">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">Ready to Start Your Journey?</h3>
          <p className="text-base mb-6 text-blue-100">Sign up now and get access to thousands of vehicles</p>
          <button onClick={() => navigate('/signup')} className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition shadow-lg">
            Sign Up Now
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default VehicleRentalHome;
