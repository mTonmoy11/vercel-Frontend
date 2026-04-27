import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#0a3a6d] to-[#08284d] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Organization Info */}
          <div className="space-y-6">
            <div className="flex items-center">
              <div className=" p-2 rounded-lg mr-3">
                <img
                  src={logo}
                  alt="Transparency Bangladesh"
                  className="w-12 h-12 object-contain"
                />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#f6824d] to-[#e05a2a] bg-clip-text text-transparent">
                Transparency Bangladesh
              </h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Fighting corruption through transparency, accountability, and
              citizen empowerment. Join us in building a corruption-free
              Bangladesh.
            </p>
            <Link to="/AboutUs">
              <button className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg mt-5">
                About Us
              </button>
            </Link>
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-[#1e3a5f] hover:bg-[#f6824d] rounded-full p-2 transition duration-300"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href="#"
                className="bg-[#1e3a5f] hover:bg-[#f6824d] rounded-full p-2 transition duration-300"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="#"
                className="bg-[#1e3a5f] hover:bg-[#f6824d] rounded-full p-2 transition duration-300"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="#"
                className="bg-[#1e3a5f] hover:bg-[#f6824d] rounded-full p-2 transition duration-300"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 border-l-4 border-[#f6824d] pl-3">
              Our Initiatives
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/reporting"
                  className="text-gray-300 hover:text-[#f6824d] transition duration-300 flex items-start"
                >
                  <span className="bg-[#f6824d] w-1.5 h-1.5 rounded-full mt-2 mr-3"></span>
                  Corruption Reporting System
                </Link>
              </li>
              <li>
                <Link
                  to="/heatmap"
                  className="text-gray-300 hover:text-[#f6824d] transition duration-300 flex items-start"
                >
                  <span className="bg-[#f6824d] w-1.5 h-1.5 rounded-full mt-2 mr-3"></span>
                  Corruption Heatmap
                </Link>
              </li>
              <li>
                <Link
                  to="/whistleblower"
                  className="text-gray-300 hover:text-[#f6824d] transition duration-300 flex items-start"
                >
                  <span className="bg-[#f6824d] w-1.5 h-1.5 rounded-full mt-2 mr-3"></span>
                  Whistleblower Protection
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-6 border-l-4 border-[#f6824d] pl-3">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/publications"
                  className="text-gray-300 hover:text-[#f6824d] transition duration-300 flex items-start"
                >
                  <span className="bg-[#f6824d] w-1.5 h-1.5 rounded-full mt-2 mr-3"></span>
                  Research Publications
                </Link>
              </li>
              <li>
                <Link
                  to="/reports"
                  className="text-gray-300 hover:text-[#f6824d] transition duration-300 flex items-start"
                >
                  <span className="bg-[#f6824d] w-1.5 h-1.5 rounded-full mt-2 mr-3"></span>
                  Annual Corruption Reports
                </Link>
              </li>
              <li>
                <Link
                  to="/tools"
                  className="text-gray-300 hover:text-[#f6824d] transition duration-300 flex items-start"
                >
                  <span className="bg-[#f6824d] w-1.5 h-1.5 rounded-full mt-2 mr-3"></span>
                  Anti-Corruption Tools
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-gray-300 hover:text-[#f6824d] transition duration-300 flex items-start"
                >
                  <span className="bg-[#f6824d] w-1.5 h-1.5 rounded-full mt-2 mr-3"></span>
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link
                  to="/legal"
                  className="text-gray-300 hover:text-[#f6824d] transition duration-300 flex items-start"
                >
                  <span className="bg-[#f6824d] w-1.5 h-1.5 rounded-full mt-2 mr-3"></span>
                  Legal Framework
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <Link to="/ContactPage">
              <h3 className="text-lg font-semibold mb-6 border-l-4 border-[#f6824d] pl-3">
                Contact Us
              </h3>
            </Link>
            <ul className="space-y-4">
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#f6824d] mt-0.5 mr-3 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-gray-300">
                  Asfia Tower, Road no 11 Banani, Dhaka 1212 Bangladesh
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#f6824d] mt-0.5 mr-3 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="text-gray-300">+880 1234 567890</span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#f6824d] mt-0.5 mr-3 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-gray-300">
                  info@transparencybangladesh.org
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#f6824d] mt-0.5 mr-3 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-gray-300">
                  Sunday to Thursday: 9:00 AM - 5:00 PM
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#1e3a5f] my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Transparency Bangladesh. All rights
            reserved.
          </p>
          <div className="flex space-x-6">
            <Link
              to="/privacy"
              className="text-gray-400 hover:text-[#f6824d] text-sm transition duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-gray-400 hover:text-[#f6824d] text-sm transition duration-300"
            >
              Terms of Service
            </Link>
            <Link
              to="/cookies"
              className="text-gray-400 hover:text-[#f6824d] text-sm transition duration-300"
            >
              Cookie Policy
            </Link>
            <Link
              to="/disclaimer"
              className="text-gray-400 hover:text-[#f6824d] text-sm transition duration-300"
            >
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
