import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import { useAuth } from "../../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const AdminLayout = () => {
  const { user, isAdmin, authReady } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!authReady) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user && !isAdmin) {
    return <Navigate to="/LoginPage" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-100 mt-14 ">
      <AdminSidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          user={user}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {/* Render nested routes here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
