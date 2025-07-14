// src/components/LoginPage.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [showUserLogin, setShowUserLogin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Reset errors
    setPhoneError('');
    setPasswordError('');
    setLoginError('');

    // Validate phone number
    if (!phone) {
      setPhoneError('Phone number is required');
      return;
    }

    if (!/^\d{11}$/.test(phone)) {
      setPhoneError('Phone number must be exactly 11 digits');
      return;
    }

    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      return;
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    // Determine login type
     let loginType;
    if (showUserLogin) {
      loginType = 'user';
    } else if (showAdminLogin) {
      loginType = 'admin';
    } else {
      setLoginError('Invalid login type');
      return;
    }

    // Attempt login
    const user = login(phone, password, loginType);


    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } else {
      setLoginError('Invalid credentials or unauthorized access');
      // CLEAR INPUT FIELDS ON FAILED LOGIN
      setPhone('');
      setPassword('');
    }
  };

  const toggleUserLogin = () => {
    setShowUserLogin(true);
    setShowAdminLogin(false);
    setPhoneError('');
    setPasswordError('');
    setLoginError('');
  };

  const toggleAdminLogin = () => {
    setShowAdminLogin(true);
    setShowUserLogin(false);
    setPhoneError('');
    setPasswordError('');
    setLoginError('');
  };

  const goBack = () => {
    setShowUserLogin(false);
    setShowAdminLogin(false);
    setPhoneError('');
    setPasswordError('');
    setLoginError('');
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Custom SVG icons
  const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#f6824d">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );

  const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#f6824d">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );

  const LoginIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="white">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
    </svg>
  );

  const UserPlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
  );

  const AdminIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#f6824d">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 7H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2v-9a2 2 0 00-2-2h-4M10 7V5a2 2 0 114 0v2m-4 0h4m-8 4h.01M14 11h.01" />
    </svg>
  );

  const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#f6824d">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );

  const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#f6824d">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );

  const EyeOpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#9ca3af">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  const EyeClosedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#9ca3af">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff5f0] to-[#ffece0] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="flex flex-col md:flex-row rounded-2xl shadow-2xl overflow-hidden bg-white">
          {/* Left Side - Branding & Info */}
          <div className="w-full md:w-2/5 bg-gradient-to-br from-[#f6824d] to-[#e05a2a] text-white p-8 flex flex-col justify-center">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white p-3 rounded-xl">
                  <ShieldIcon />
                </div>
                <h1 className="text-3xl font-bold">Secure Login Portal</h1>
              </div>
              <p className="text-[#ffd8c5]">Enterprise-grade security for your digital assets</p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full md:w-3/5 p-8">
            {/* Initial View - Login/Signup Buttons */}
            {!showUserLogin && !showAdminLogin ? (
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
                <p className="text-gray-600 mb-8">Sign in to access your account</p>

                <div className="space-y-6">
                  <button
                    onClick={toggleUserLogin}
                    className="btn w-full text-lg bg-gradient-to-r from-[#f6824d] to-[#e05a2a] hover:from-[#e05a2a] hover:to-[#c54a1a] text-white transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <LoginIcon className="mr-2 inline-block" />
                    Login to your account
                  </button>

                  <div className="divider text-gray-400">OR</div>

                  <div>
                    <p className="text-gray-600 text-center mb-4">Don't have an account yet?</p>
                    <Link to="/IDRegistrationForm">
                      <button className="btn btn-outline w-full text-lg border-[#f6824d] text-[#f6824d] hover:bg-[#f6824d] hover:text-white transition-colors duration-300">
                        <UserPlusIcon className="mr-2 inline-block" />
                        Create new account
                      </button>
                    </Link>
                  </div>

                  <div className="text-center mt-8">
                    <button
                      onClick={toggleAdminLogin}
                      className="btn btn-ghost text-[#f6824d] hover:bg-[#fff5f0]"
                    >
                      <AdminIcon className="mr-2 inline-block" />
                      Admin Login
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Login Form */
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {showUserLogin ? 'User Login' : 'Admin Login'}
                </h2>
                <p className="text-gray-600 mb-8">
                  Sign in to your {showUserLogin ? 'user' : 'admin'} account
                </p>

                {loginError && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {loginError}
                  </div>
                )}

                <form onSubmit={handleLogin}>
                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text text-lg">Phone Number</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <PhoneIcon />
                      </span>
                      <input
                        type="tel"
                        placeholder="01XXXXXXXXX"
                        className={`input input-bordered w-full pl-10 text-lg py-4 ${phoneError ? 'border-red-500' : ''}`}
                        required
                        value={phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 11);
                          setPhone(value);
                          if (phoneError) setPhoneError('');
                        }}
                      />
                    </div>
                    {phoneError && (
                      <div className="mt-2 text-red-500 text-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {phoneError}
                      </div>
                    )}
                  </div>

                  <div className="form-control mb-6">
                    <label className="label">
                      <span className="label-text text-lg">Password</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <LockIcon />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={`input input-bordered w-full pl-10 pr-12 text-lg py-4 ${passwordError ? 'border-red-500' : ''}`}
                        required
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (passwordError) setPasswordError('');
                        }}
                      />
                      {/* Fixed eye icon - always visible */}
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 z-10"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                      </button>
                    </div>
                    {passwordError && (
                      <div className="mt-2 text-red-500 text-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {passwordError}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <label className="cursor-pointer label">
                      <input
                        type="checkbox"
                        className="checkbox"
                        style={{ accentColor: "#f6824d" }}
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                      />
                      <span className="label-text ml-2 text-gray-700">Remember me</span>
                    </label>
                    <a href="#" className="text-[#f6824d] hover:underline">Forgot password?</a>
                  </div>

                  <button
                    type="submit"
                    className="btn w-full text-lg py-4 bg-gradient-to-r from-[#f6824d] to-[#e05a2a] border-[#f6824d] hover:from-[#e05a2a] hover:to-[#c54a1a] text-white transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    Sign In
                  </button>
                </form>

                <div className="text-center mt-6">
                  <button
                    onClick={goBack}
                    className="btn btn-ghost text-[#f6824d] hover:bg-[#fff5f0]"
                  >
                    <BackIcon className="mr-2 inline-block" />
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">© 2025 Transparency Bangladesh. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <a href="#" className="hover:text-[#f6824d] text-sm">Privacy Policy</a>
            <a href="#" className="hover:text-[#f6824d] text-sm">Terms of Service</a>
            <a href="#" className="hover:text-[#f6824d] text-sm">Contact Support</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;