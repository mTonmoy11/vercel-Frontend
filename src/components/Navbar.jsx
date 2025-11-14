import { NavLink, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiUser, FiX, FiMenu, FiBell } from "react-icons/fi";
import logo from "../assets/images/logo.png";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const {
    user,
    isAdmin,
    adminUser,
    logout,
    notifications,
    markNotificationAsRead,
  } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout?.();
    navigate("/");
    setIsMenuOpen(false);
  };

  const isAuthed = !!user || isAdmin;
  const displayName =
    user?.displayName ||
    adminUser?.name ||
    user?.email ||
    adminUser?.email ||
    "User";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // SAFE: handle undefined notifications
  const notificationsSafe = Array.isArray(notifications) ? notifications : [];
  const unreadCount = notificationsSafe.filter((n) => !n?.read).length;

  // Get latest 3 notifications sorted by date (newest first)
  const latestNotifications = [...notificationsSafe]
    .sort((a, b) => new Date(b?.date || 0) - new Date(a?.date || 0))
    .slice(0, 3);

  // Format time difference (e.g., "2 hours ago")
  const formatTimeDifference = (date) => {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ${
          scrolled ? "bg-white shadow-lg py-2" : "bg-[#f6824d] py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/">
              <div className="flex items-center">
                <img
                  className="w-10 h-10 md:w-14 md:h-14 transition-all duration-300"
                  src={logo}
                  alt="Transparency Bangladesh Logo"
                />
                <span
                  className={`ml-2 text-xl md:text-2xl font-bold transition-all duration-300 ${
                    scrolled ? "text-[#f6824d]" : "text-white"
                  }`}
                >
                  Transparency Bangladesh
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `relative px-1 py-2 font-medium transition-all duration-300 ${
                    isActive
                      ? "text-[#33a954] font-bold"
                      : scrolled
                      ? "text-gray-700 hover:text-[#f6824d]"
                      : "text-white hover:text-[#33a954]"
                  }`
                }
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#33a954] transition-all duration-300 group-hover:w-full"></span>
              </NavLink>

              <Link to="/AboutUs">
                <button
                  className={`relative px-1 py-2 font-medium transition-all duration-300 ${
                    scrolled
                      ? "text-gray-700 hover:text-[#f6824d]"
                      : "text-white hover:text-[#33a954]"
                  }`}
                >
                  About
                </button>
              </Link>

              <NavLink
                to="/ContactPage"
                className={({ isActive }) =>
                  `relative px-1 py-2 font-medium transition-all duration-300 ${
                    isActive
                      ? "text-[#33a954] font-bold"
                      : scrolled
                      ? "text-gray-700 hover:text-[#f6824d]"
                      : "text-white hover:text-[#33a954]"
                  }`
                }
              >
                Contact
              </NavLink>

              {/* Conditionally show Dashboard */}
              {isAuthed && (
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `relative px-1 py-2 font-medium transition-all duration-300 ${
                      isActive
                        ? "text-[#33a954] font-bold"
                        : scrolled
                        ? "text-gray-700 hover:text-[#f6824d]"
                        : "text-white hover:text-[#33a954]"
                    }`
                  }
                >
                  Dashboard
                </NavLink>
              )}

              {/* Notification Icon - Only shown when user is logged in */}
              {user && (
                <div className="relative">
                  <button
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    className={`p-2 rounded-full relative ${
                      scrolled
                        ? "text-gray-700 hover:bg-gray-100"
                        : "text-white hover:bg-[#e67342]"
                    } transition-colors duration-300`}
                  >
                    <FiBell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {isNotificationOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg overflow-hidden z-50">
                      <div className="py-1">
                        <div className="px-4 py-2 border-b bg-gray-50">
                          <h3 className="text-sm font-medium text-gray-900">
                            Notifications
                          </h3>
                        </div>

                        {latestNotifications.length > 0 ? (
                          latestNotifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`px-4 py-3 border-b hover:bg-gray-50 cursor-pointer ${
                                !notification.read ? "bg-blue-50" : ""
                              }`}
                              onClick={() => {
                                if (!notification.read) {
                                  markNotificationAsRead(notification.id);
                                }
                                setIsNotificationOpen(false);
                                // Add navigation to relevant page
                                // navigate('/case');
                              }}
                            >
                              <p className="text-sm text-gray-800">
                                {notification.text}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatTimeDifference(notification.date)}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="px-4 py-3 text-sm text-gray-500">
                            No notifications
                          </p>
                        )}

                        <div className="px-4 py-2 bg-gray-50 text-center">
                          <button
                            className="text-sm text-[#33a954] font-medium hover:underline"
                            onClick={() => {
                              navigate("/notifications");
                              setIsNotificationOpen(false);
                            }}
                          >
                            View All
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Conditionally show Login/Logout */}
              {isAuthed ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 bg-[#33a954] text-white rounded-full hover:bg-[#2a8d45] transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <FiUser className="mr-2" />
                  Logout
                </button>
              ) : (
                <NavLink
                  to="/LoginPage"
                  className="flex items-center px-4 py-2 bg-[#33a954] text-white rounded-full hover:bg-[#2a8d45] transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <FiUser className="mr-2" />
                  Log In
                </NavLink>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              {/* Notification Icon for Mobile - Only shown when user is logged in */}
              {user && (
                <div className="relative mr-3">
                  <button
                    onClick={() => {
                      navigate("/notifications");
                      setIsMenuOpen(false);
                    }}
                    className={`p-2 rounded-full relative ${
                      scrolled
                        ? "text-gray-700 hover:bg-gray-100"
                        : "text-white hover:bg-[#e67342]"
                    } transition-colors duration-300`}
                  >
                    <FiBell className="h-6 w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </div>
              )}

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-full ${
                  scrolled
                    ? "bg-[#f6824d] text-white"
                    : "bg-white text-[#f6824d]"
                }`}
              >
                {isMenuOpen ? (
                  <FiX className="h-6 w-6" />
                ) : (
                  <FiMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden fixed inset-0 z-40 bg-white transform ${
            isMenuOpen ? "translate-y-0" : "-translate-y-full"
          } transition-transform duration-500 ease-in-out`}
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-6 border-b">
              <div className="flex items-center">
                <img
                  className="w-10 h-10"
                  src={logo}
                  alt="Transparency Bangladesh Logo"
                />
                <span className="ml-2 text-xl font-bold text-[#f6824d]">
                  Transparency Bangladesh
                </span>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-full bg-[#f6824d] text-white"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center flex-grow space-y-5">
              <NavLink
                to="/"
                className="text-2xl font-medium px-4 py-2 transition-all text-black"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </NavLink>

              <Link to="/AboutUs">
                <button
                  className="text-2xl px-1 py-2 font-medium transition-all duration-300 text-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </button>
              </Link>

              <NavLink
                to="/ContactPage"
                className="text-2xl font-medium px-4 py-2 transition-all text-black"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </NavLink>

              {/* Conditionally show Dashboard in mobile */}
              {isAuthed && (
                <NavLink
                  to="/dashboard"
                  className="text-2xl font-medium px-4 py-2 transition-all text-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
              )}

              {/* Conditionally show Notifications in mobile */}
              {user && (
                <NavLink
                  to="/notifications"
                  className="text-2xl font-medium px-4 py-2 transition-all text-black flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiBell className="mr-2" />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </NavLink>
              )}

              {/* Conditionally show Login/Logout in mobile */}
              {isAuthed ? (
                <button
                  onClick={handleLogout}
                  className="mt-8 flex items-center px-6 py-3 bg-[#33a954] text-white text-xl rounded-full hover:bg-[#2a8d45] transition-all duration-300"
                >
                  <FiUser className="mr-2" />
                  Logout
                </button>
              ) : (
                <NavLink
                  to="/LoginPage"
                  className="mt-8 flex items-center px-6 py-3 bg-[#33a954] text-white text-xl rounded-full hover:bg-[#2a8d45] transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiUser className="mr-2" />
                  Log In
                </NavLink>
              )}
            </div>

            <div className="p-6 text-center text-gray-500">
              <p>© {new Date().getFullYear()} Transparency Bangladesh</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content overlap */}
      <div
        className={`w-full transition-all duration-500 ${
          scrolled ? "h-16 md:h-20" : "h-24 md:h-28"
        }`}
      ></div>
    </>
  );
};

export default Navbar;
