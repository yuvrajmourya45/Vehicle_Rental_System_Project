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

      {/* Hero Section */}
      <section className="relative h-[500px] sm:h-[600px] lg:h-[700px] bg-cover bg-center flex items-center justify-center text-white" style={{ backgroundImage: `url(${bannerCar})` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>
        <div className="relative text-center container-responsive z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-4 sm:mb-6 drop-shadow-lg leading-tight">
            Rent Your <span className="text-blue-400">Dream</span> Vehicle
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-gray-100 max-w-3xl mx-auto leading-relaxed">
            Choose from cars, bikes, buses & trucks at affordable prices
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <button 
              onClick={() => navigate('/vehicles')} 
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg text-sm sm:text-base"
            >
              Browse Vehicles
            </button>
            <button 
              onClick={() => navigate('/signup')} 
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg text-sm sm:text-base"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container-responsive">
          <h3 className="heading-responsive font-bold mb-6 sm:mb-8 text-center text-gray-800">
            Browse by Category
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {[
              { name: 'Cars', icon: '🚗', desc: 'Comfortable rides' },
              { name: 'Bikes', icon: '🏍️', desc: 'Quick & efficient' },
              { name: 'Buses', icon: '🚌', desc: 'Group travel' },
              { name: 'Trucks', icon: '🚚', desc: 'Heavy duty' }
            ].map((category) => (
              <div 
                key={category.name} 
                onClick={() => navigate('/vehicles')} 
                className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 text-center cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100 group"
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h4 className="text-base sm:text-lg font-bold text-gray-800 mb-1">{category.name}</h4>
                <p className="text-xs sm:text-sm text-gray-600">{category.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-8 sm:py-12 lg:py-16">
        <div className="container-responsive">
          <h3 className="heading-responsive font-bold text-center mb-2 sm:mb-3 text-gray-800">
            How It Works
          </h3>
          <p className="text-center text-gray-600 mb-8 sm:mb-10 text-sm sm:text-base">
            Rent a vehicle in 3 simple steps
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: '🚗',
                title: 'Choose Your Vehicle',
                desc: 'Browse our wide selection of quality vehicles',
                color: 'blue'
              },
              {
                icon: '📅',
                title: 'Book Instantly',
                desc: 'Select dates and confirm your booking online',
                color: 'green'
              },
              {
                icon: '💳',
                title: 'Pay Securely',
                desc: 'Complete payment safely with multiple options',
                color: 'purple'
              }
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-${step.color}-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-${step.color}-200 transition`}>
                  <span className="text-2xl sm:text-3xl">{step.icon}</span>
                </div>
                <h4 className="font-bold text-base sm:text-lg lg:text-xl mb-2 text-gray-800">{step.title}</h4>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="container-responsive">
          <h3 className="heading-responsive font-bold text-center mb-8 sm:mb-12 text-gray-800">
            Why Choose Us?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: '✅', title: 'Best Prices', desc: 'Competitive rates with no hidden fees' },
              { icon: '🔒', title: 'Secure Booking', desc: 'Safe and encrypted payment processing' },
              { icon: '🚗', title: 'Quality Vehicles', desc: 'Well-maintained and regularly serviced' },
              { icon: '📞', title: '24/7 Support', desc: 'Round-the-clock customer assistance' },
              { icon: '⚡', title: 'Instant Booking', desc: 'Quick and easy reservation process' },
              { icon: '🌍', title: 'Multiple Locations', desc: 'Available in cities across the country' }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg transition text-center">
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{feature.icon}</div>
                <h4 className="font-bold text-base sm:text-lg mb-2 text-gray-800">{feature.title}</h4>
                <p className="text-sm sm:text-base text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container-responsive">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 text-center shadow-xl">
            <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-3 sm:mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 text-blue-100 max-w-2xl mx-auto">
              Sign up now and get access to thousands of vehicles with exclusive member benefits
            </p>
            <button 
              onClick={() => navigate('/signup')} 
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition shadow-lg text-sm sm:text-base"
            >
              Sign Up Now - It's Free!
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default VehicleRentalHome;
