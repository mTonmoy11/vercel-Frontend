import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import ReportingTool from "../pages/ReportingTool";
import HeatMap from "../pages/HeatMap";
import CaseTrack from "../pages/CaseTrack";
import Form from "../pages/Form";
import AboutUs from "../components/home/AboutUs";
import LoginPage from "../components/login/LoginPage";
import IDRegistrationForm from "../components/login/IDRegistrationForm ";
import ContactPage from "../components/ContactPage";
import UserDashboard from "../pages/UserDashboard";
import NotificationsPage from "../pages/NotificationsPage";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authReady } = useAuth();
  if (!authReady) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/LoginPage" replace />;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/reporting", element: <ReportingTool /> },
      { path: "/heatmap", element: <HeatMap /> },
      { path: "/case", element: <CaseTrack /> },
      { path: "/form", element: <Form /> },
      { path: "/AboutUs", element: <AboutUs /> },
      { path: "/LoginPage", element: <LoginPage /> },
      { path: "/IDRegistrationForm", element: <IDRegistrationForm /> },
      { path: "/ContactPage", element: <ContactPage /> },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/notifications",
        element: (
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
