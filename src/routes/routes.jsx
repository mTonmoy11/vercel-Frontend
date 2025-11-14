import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import ReportingTool from "../pages/ReportingTool";
import HeatMap from "../pages/HeatMap";
import GovtSpending from "../pages/GovtSpending";
import EducationHub from "../pages/EducationHub";
import Reward from "../pages/Reward";
import CaseTrack from "../pages/CaseTrack";
import Form from "../pages/Form";
import DetailedReport from "../components/govtSpending/DetailedReport";
import AboutUs from "../components/home/AboutUs";
import LoginPage from "../components/login/LoginPage";
import IDRegistrationForm from "../components/login/IDRegistrationForm ";
import ContactPage from "../components/ContactPage";
import TrainingSession from "../components/education/TrainingSession";
import AntiCorruptionLaws from "../components/education/AntiCorruptionLaws";
import AntiCorruptionEvents from "../components/education/AntiCorruptionEvents";
import AdminLayout from "../admin/layouts/AdminLaout";
import Dashboard from "../admin/pages/Dashboard";
import ManageUsers from "../admin/pages/ManageUsers";
import ManageAdmins from "../admin/pages/ManageAdmins";
import ManageReports from "../admin/pages/ManageReports";
import ManageCases from "../admin/pages/ManageCases";
import ManageHeatmap from "../admin/pages/ManageHeatmap";
import ManageEducation from "../admin/pages/ManageEducation";
import ManageGovtSpending from "../admin/pages/ManageGovtSpending";
import UserDashboard from "../pages/UserDashboard";
import NotificationsPage from "../pages/NotificationsPage";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRouteWrapper = ({ children }) => {
  const { user, isAdmin, adminUser, authReady } = useAuth();

  if (!authReady) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Allow if either Firebase user is admin or admin session exists
  if (user?.role === "admin" || (isAdmin && adminUser)) {
    return children;
  }

  return <Navigate to="/LoginPage" replace />;
};

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
      { path: "/spending", element: <GovtSpending /> },
      { path: "/education", element: <EducationHub /> },
      { path: "/reward", element: <Reward /> },
      { path: "/case", element: <CaseTrack /> },
      { path: "/form", element: <Form /> },
      { path: "/DetailedReport", element: <DetailedReport /> },
      { path: "/AboutUs", element: <AboutUs /> },
      { path: "/LoginPage", element: <LoginPage /> },
      { path: "/IDRegistrationForm", element: <IDRegistrationForm /> },
      { path: "/ContactPage", element: <ContactPage /> },
      { path: "/TrainingSession", element: <TrainingSession /> },
      { path: "/AntiCorruptionLaws", element: <AntiCorruptionLaws /> },
      { path: "/AntiCorruptionEvents", element: <AntiCorruptionEvents /> },
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
  {
    path: "/admin",
    element: (
      <AdminRouteWrapper>
        <AdminLayout />
      </AdminRouteWrapper>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "users", element: <ManageUsers /> },
      { path: "admins", element: <ManageAdmins /> },
      { path: "reports", element: <ManageReports /> },
      { path: "cases", element: <ManageCases /> },
      { path: "heatmap", element: <ManageHeatmap /> },
      { path: "education", element: <ManageEducation /> },
      { path: "govt-spending", element: <ManageGovtSpending /> },
    ],
  },
]);
