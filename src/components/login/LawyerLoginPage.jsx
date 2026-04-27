import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiCheckCircle,
  FiLoader,
} from "react-icons/fi";
import { MdOutlineGavel } from "react-icons/md";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const LawyerLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validation
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      setIsLoading(false);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/lawyer/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message || "Login failed. Please try again.");
        setIsLoading(false);
        return;
      }

      // Store lawyer info in localStorage
      localStorage.setItem("lawyerLoggedIn", "true");
      localStorage.setItem("lawyerData", JSON.stringify(result.data));
      localStorage.setItem("lawyerEmail", result.data.contactEmail);

      setSuccess(true);

      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate("/lawyer-dashboard", { replace: true });
      }, 1500);
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again later.");
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-[#fff5f0] to-gray-50 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-green-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle className="text-3xl text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Login Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Welcome back! Redirecting to your dashboard...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#fff5f0] to-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <MdOutlineGavel className="text-2xl text-orange-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Lawyer Login
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Log in to your account to manage cases and clients
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <FiAlertCircle className="text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition bg-gray-50 text-gray-800"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition bg-gray-50 text-gray-800"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-[#f6824d] to-[#e05a2a] hover:from-[#e05a2a] hover:to-[#c54a1a] text-white font-semibold rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <FiLoader className="animate-spin" />
                Logging in...
              </>
            ) : (
              "Login to your account"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-sm text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Registration Link */}
        <Link to="/lawyer-registration" className="block">
          <button
            type="button"
            className="w-full py-3 border-2 border-[#f6824d] text-[#f6824d] font-semibold rounded-lg hover:bg-orange-50 transition"
          >
            Create new account
          </button>
        </Link>

        {/* Footer */}
        <p className="text-xs text-gray-500 text-center mt-6">
          By logging in, you agree to our terms and conditions
        </p>
      </div>
    </section>
  );
};

export default LawyerLoginPage;
