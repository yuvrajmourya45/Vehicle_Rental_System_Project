import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 px-8 py-10">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <h4 className="text-white font-semibold mb-4">CarRental</h4>
          <p>Your trusted car rental partner.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul className="space-y-2">
            <li>About</li>
            <li>Careers</li>
            <li>Blog</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Support</h4>
          <ul className="space-y-2">
            <li>Help Center</li>
            <li>Terms</li>
            <li>Privacy</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Contact</h4>
          <p>Email: support@carrental.com</p>
        </div>
      </div>
      <p className="text-center mt-10 text-sm">© 2026 CarRental. All rights reserved.</p>
    </footer>
  );
}
