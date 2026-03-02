import React from "react";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-responsive py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="text-white font-bold text-lg sm:text-xl mb-3 sm:mb-4">CarRental</h4>
            <p className="text-sm sm:text-base mb-4 leading-relaxed">Your trusted vehicle rental partner. We provide quality vehicles at affordable prices with excellent customer service.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition p-2 hover:bg-gray-800 rounded-lg">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition p-2 hover:bg-gray-800 rounded-lg">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition p-2 hover:bg-gray-800 rounded-lg">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Company</h4>
            <ul className="space-y-2 text-sm sm:text-base">
              <li><a href="/about" className="hover:text-white transition">About Us</a></li>
              <li><a href="#" className="hover:text-white transition">Careers</a></li>
              <li><a href="#" className="hover:text-white transition">Blog</a></li>
              <li><a href="#" className="hover:text-white transition">Press</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Support</h4>
            <ul className="space-y-2 text-sm sm:text-base">
              <li><a href="#" className="hover:text-white transition">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="/contact" className="hover:text-white transition">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Contact Info</h4>
            <div className="space-y-3 text-sm sm:text-base">
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                <span>support@carrental.com</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                <span>123 Rental Street, City, State 12345</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-center sm:text-left">© 2024 CarRental. All rights reserved.</p>
            <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6 text-sm">
              <a href="#" className="hover:text-white transition">Terms</a>
              <a href="#" className="hover:text-white transition">Privacy</a>
              <a href="#" className="hover:text-white transition">Cookies</a>
              <a href="#" className="hover:text-white transition">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
