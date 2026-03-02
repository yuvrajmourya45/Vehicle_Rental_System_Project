import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Award, Users, Car, Shield } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* Header */}
      <div className="bg-blue-600 text-white py-16 px-8 text-center">
        <h2 className="text-4xl font-bold mb-4">About Us</h2>
        <p className="text-lg">Your trusted car rental partner since 2020</p>
      </div>

      {/* About Content */}
      <div className="px-8 py-16 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
          <h3 className="text-3xl font-bold mb-6 text-center">Who We Are</h3>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            CarRental is a leading vehicle rental service provider committed to making your travel experience seamless and enjoyable. 
            With a fleet of over 500 vehicles ranging from economy cars to luxury sedans, we cater to all your transportation needs.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Our mission is to provide reliable, affordable, and convenient car rental services with exceptional customer support. 
            Whether you need a car for a day, a week, or a month, we've got you covered.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Car className="mx-auto mb-4 text-blue-600" size={48} />
            <h4 className="text-3xl font-bold text-blue-600 mb-2">500+</h4>
            <p className="text-gray-600">Vehicles</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Users className="mx-auto mb-4 text-blue-600" size={48} />
            <h4 className="text-3xl font-bold text-blue-600 mb-2">10K+</h4>
            <p className="text-gray-600">Happy Customers</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Award className="mx-auto mb-4 text-blue-600" size={48} />
            <h4 className="text-3xl font-bold text-blue-600 mb-2">50+</h4>
            <p className="text-gray-600">Awards Won</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Shield className="mx-auto mb-4 text-blue-600" size={48} />
            <h4 className="text-3xl font-bold text-blue-600 mb-2">100%</h4>
            <p className="text-gray-600">Secure</p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h3 className="text-3xl font-bold mb-8 text-center">Why Choose Us</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">💰</div>
              <h4 className="font-semibold text-xl mb-2">Best Prices</h4>
              <p className="text-gray-600">Competitive rates with no hidden charges</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🔧</div>
              <h4 className="font-semibold text-xl mb-2">Well Maintained</h4>
              <p className="text-gray-600">All vehicles regularly serviced and inspected</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">⏰</div>
              <h4 className="font-semibold text-xl mb-2">24/7 Support</h4>
              <p className="text-gray-600">Round the clock customer assistance</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
