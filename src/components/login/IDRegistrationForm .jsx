import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const IDRegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    nid: '',
    dob: '',
    phone: '',
    address: '',
    division: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Bangladesh divisions
  const divisions = [
    'Select your division',
    'Dhaka',
    'Chittagong',
    'Rajshahi',
    'Khulna',
    'Barishal',
    'Sylhet',
    'Rangpur',
    'Mymensingh'
  ];

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        navigate('/LoginPage');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isSubmitted, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.nid.trim()) {
      newErrors.nid = 'NID number is required';
    } else if (!/^\d{10,20}$/.test(formData.nid)) {
      newErrors.nid = 'NID must be 10-20 digits';
    }

    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    } else {
      const dobDate = new Date(formData.dob);
      const today = new Date();
      const minAgeDate = new Date();
      minAgeDate.setFullYear(today.getFullYear() - 18);

      if (dobDate > minAgeDate) {
        newErrors.dob = 'You must be at least 18 years old';
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Address is too short';
    }

    // Validate division
    if (!formData.division || formData.division === 'Select your division') {
      newErrors.division = 'Please select your division';
    }

    // Password validation - REMOVED LENGTH REQUIREMENT
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (
      !/[A-Z]/.test(formData.password) ||
      !/[a-z]/.test(formData.password) ||
      !/[0-9]/.test(formData.password) ||
      !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password)
    ) {
      newErrors.password = 'Password must contain uppercase, lowercase, number, and special character';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log('Form submitted:', formData);
      setIsSubmitted(true);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      nid: '',
      dob: '',
      phone: '',
      address: '',
      division: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    setIsSubmitted(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <style jsx>{`
        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .form-container {
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
        }

        .input-field:focus {
          box-shadow: 0 0 0 3px rgba(246, 130, 77, 0.3);
        }

        .notification {
          animation: slideIn 0.5s forwards;
        }

        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>

      <div className="w-full max-w-2xl">
        {isSubmitted && (
          <div className="notification fixed top-5 right-5 bg-[#099e20] text-white px-6 py-4 rounded-lg shadow-lg z-50">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className='font-bold'>ID Created Successfully! Redirecting to login...</span>
            </div>
          </div>
        )}

        <div className="form-container bg-white rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#f6824d] to-[#c6542c] text-white p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center">
              <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>
              </svg>
              User ID Registration
            </h1>
            <p className="mt-2 opacity-90">Create your new identification account</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            {/* Full Name Field */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2 flex items-center">
                <span>Full Name</span>
                <span className="text-red-500 ml-1">*</span>
                {errors.name && <span className="ml-2 text-red-500 text-sm font-normal">{errors.name}</span>}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg input-field ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-[#f6824d]`}
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* NID Card Number */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center">
                  <span>NID Card Number</span>
                  <span className="text-red-500 ml-1">*</span>
                  {errors.nid && <span className="ml-2 text-red-500 text-sm font-normal">{errors.nid}</span>}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="nid"
                    value={formData.nid}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg input-field ${
                      errors.nid ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-[#f6824d]`}
                    placeholder="Enter NID number"
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center">
                  <span>Date of Birth</span>
                  <span className="text-red-500 ml-1">*</span>
                  {errors.dob && <span className="ml-2 text-red-500 text-sm font-normal">{errors.dob}</span>}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg input-field ${
                      errors.dob ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-[#f6824d]`}
                    max={(() => {
                      const today = new Date();
                      const minAgeDate = new Date();
                      minAgeDate.setFullYear(today.getFullYear() - 18);
                      return minAgeDate.toISOString().split('T')[0];
                    })()}
                  />
                </div>
              </div>
            </div>

            {/* Phone Number */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2 flex items-center">
                <span>Phone Number</span>
                <span className="text-red-500 ml-1">*</span>
                {errors.phone && <span className="ml-2 text-red-500 text-sm font-normal">{errors.phone}</span>}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg input-field ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-[#f6824d]`}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            {/* Present Address */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2 flex items-center">
                <span>Present Address</span>
                <span className="text-red-500 ml-1">*</span>
                {errors.address && <span className="ml-2 text-red-500 text-sm font-normal">{errors.address}</span>}
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg input-field ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-[#f6824d]`}
                  placeholder="Enter your current address"
                  rows="4"
                ></textarea>
              </div>
            </div>

            {/* Division Dropdown */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2 flex items-center">
                <span>Division</span>
                <span className="text-red-500 ml-1">*</span>
                {errors.division && <span className="ml-2 text-red-500 text-sm font-normal">{errors.division}</span>}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <select
                  name="division"
                  value={formData.division}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg input-field appearance-none ${
                    errors.division ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-[#f6824d] bg-white`}
                >
                  {divisions.map((division, index) => (
                    <option key={index} value={division}>
                      {division}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 fill-current text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Password */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center">
                  <span>Password</span>
                  <span className="text-red-500 ml-1">*</span>
                  {errors.password && <span className="ml-2 text-red-500 text-sm font-normal">{errors.password}</span>}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg input-field ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-[#f6824d]`}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center">
                  <span>Confirm Password</span>
                  <span className="text-red-500 ml-1">*</span>
                  {errors.confirmPassword && <span className="ml-2 text-red-500 text-sm font-normal">{errors.confirmPassword}</span>}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg input-field ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-[#f6824d]`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Requirements - UPDATED TO REMOVE LENGTH REQUIREMENT */}
            <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">Password must contain:</p>
              <ul className="text-xs text-gray-600 grid grid-cols-2 gap-1">
                <li className={`flex items-center ${/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}`}>
                  <svg className={`w-4 h-4 mr-1 ${/[A-Z]/.test(formData.password) ? 'text-green-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={/[A-Z]/.test(formData.password) ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}></path>
                  </svg>
                  One uppercase letter
                </li>
                <li className={`flex items-center ${/[a-z]/.test(formData.password) ? 'text-green-600' : ''}`}>
                  <svg className={`w-4 h-4 mr-1 ${/[a-z]/.test(formData.password) ? 'text-green-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={/[a-z]/.test(formData.password) ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}></path>
                  </svg>
                  One lowercase letter
                </li>
                <li className={`flex items-center ${/[0-9]/.test(formData.password) ? 'text-green-600' : ''}`}>
                  <svg className={`w-4 h-4 mr-1 ${/[0-9]/.test(formData.password) ? 'text-green-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={/[0-9]/.test(formData.password) ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}></path>
                  </svg>
                  One number
                </li>
                <li className={`flex items-center ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? 'text-green-600' : ''}`}>
                  <svg className={`w-4 h-4 mr-1 ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? 'text-green-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}></path>
                  </svg>
                  One special character
                </li>
                <li className={`flex items-center ${formData.password === formData.confirmPassword && formData.confirmPassword ? 'text-green-600' : ''}`}>
                  <svg className={`w-4 h-4 mr-1 ${formData.password === formData.confirmPassword && formData.confirmPassword ? 'text-green-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={formData.password === formData.confirmPassword && formData.confirmPassword ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}></path>
                  </svg>
                  Passwords match
                </li>
              </ul>
            </div>

            {/* Form Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                type="submit"
                className="flex-1 bg-green-500 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#f6824d] focus:ring-opacity-50 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Create ID
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="flex-1 bg-red-500 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Reset Form
              </button>
            </div>
          </form>

          <div className="bg-gray-100 px-6 py-4 text-center text-gray-600 text-sm">
            <p>&copy; 2025 Transparency Bangladesh Registration System | All Rights Reserved</p>
          </div>
        </div>

        <div className="mt-6 text-center text-white text-sm">
          <p>Secure your identity with our encrypted registration process</p>
        </div>
      </div>
    </div>
  );
};

export default IDRegistrationForm; 