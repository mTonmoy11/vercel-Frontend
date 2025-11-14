import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleAdminLogout = () => {
    console.log("🚪 Admin logging out...");

    // Clear admin data from localStorage
    localStorage.removeItem("adminUser");
    localStorage.removeItem("isAdmin");

    console.log("✅ Admin data cleared");

    // Redirect to login page
    window.location.href = "/LoginPage";
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-gray-200 shadow-sm backdrop-blur-sm bg-opacity-90">
      <div className="flex h-full items-center justify-between px-4 md:px-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800 hidden sm:block">
            Admin Console
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gray-100 border-2 border-dashed rounded-xl w-10 h-10" />
            <div className="text-right hidden md:block">
              <p className="font-medium text-gray-800">{user?.name}</p>
              <div className="flex items-center justify-end">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-1.5 rounded-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>Sign out</span>
          </button>

          <button
            onClick={handleAdminLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
