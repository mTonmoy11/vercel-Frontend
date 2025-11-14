import React, { useEffect, useState } from "react";
import {
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
  FiBarChart2,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Update = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [stats, setStats] = useState({
    totalCases: 0,
    solvedCases: 0,
    pendingCases: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/reports");
      const result = await response.json();

      if (result.success) {
        // Transform backend data to match case structure
        const transformedCases = result.data.slice(0, 3).map((report) => ({
          id: `C-${new Date(report.createdAt).getFullYear()}-${report._id
            .slice(-6)
            .toUpperCase()}`,
          name: report.isAnonymous
            ? "Anonymous Report"
            : `State vs. ${report.name || "Unknown"}`,
          type: report.problemType,
          status:
            report.status === "resolved"
              ? "Solved"
              : report.status === "under-review"
              ? "Ongoing"
              : report.status === "pending"
              ? "Delayed"
              : report.status,
          sentence: report.status === "resolved" ? "Resolved" : "Pending",
          lastUpdate: new Date(report.createdAt).toLocaleDateString(),
        }));

        setCases(transformedCases);

        // Calculate stats from all reports
        const totalCases = result.data.length;
        const solvedCases = result.data.filter(
          (report) => report.status === "resolved"
        ).length;
        const pendingCases = result.data.filter(
          (report) =>
            report.status === "pending" || report.status === "under-review"
        ).length;

        setStats({
          totalCases,
          solvedCases,
          pendingCases,
        });
      } else {
        setError("Failed to fetch cases");
      }
    } catch (err) {
      console.error("Error fetching cases:", err);
      setError("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    {
      title: "Total Cases",
      value: stats.totalCases,
      icon: <FiBarChart2 className="text-2xl" />,
      color: "bg-orange-100",
      textColor: "text-orange-600",
    },
    {
      title: "Solved Cases",
      value: stats.solvedCases,
      icon: <FiCheckCircle className="text-2xl" />,
      color: "bg-green-100",
      textColor: "text-green-600",
    },
    {
      title: "Pending Cases",
      value: stats.pendingCases,
      icon: <FiClock className="text-2xl" />,
      color: "bg-blue-100",
      textColor: "text-blue-600",
    },
  ];

  const handleReportCase = () => {
    if (!user) {
      navigate("/LoginPage");
    } else {
      navigate("/form");
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "ongoing":
        return "bg-blue-100 text-blue-800";
      case "appealed":
        return "bg-purple-100 text-purple-800";
      case "delayed":
        return "bg-red-100 text-red-800";
      case "solved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "bribery":
        return "text-orange-600";
      case "embezzlement":
        return "text-red-600";
      case "fraud":
        return "text-purple-600";
      case "nepotism":
        return "text-yellow-600";
      case "abuse of power":
        return "text-indigo-600";
      default:
        return "text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold mb-2">Error Loading Data</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Action Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
            <h3 className="text-xl font-bold mb-3">
              Need to Report a New Case?
            </h3>
            <p className="mb-4 opacity-90">
              Submit information about a new corruption incident
            </p>
            <button
              onClick={handleReportCase}
              className="px-5 py-3 bg-white text-orange-600 rounded-full font-medium hover:bg-gray-100 transition-colors"
            >
              Report Your case
            </button>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <h3 className="text-xl font-bold mb-3">Need Case Assistance?</h3>
            <p className="mb-4 opacity-90">
              Contact our legal team for support with your case
            </p>
            <button className="px-5 py-3 bg-white text-blue-600 rounded-full font-medium hover:bg-gray-100 transition-colors">
              Contact Support
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className={`${stat.color} rounded-2xl shadow-lg p-6 transform transition-all duration-500 hover:scale-105 hover:shadow-xl`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    {stat.title}
                  </h3>
                  <p className={`text-3xl font-bold ${stat.textColor}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.textColor}`}>
                  {stat.icon}
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-white rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${stat.textColor.replace(
                      "text",
                      "bg"
                    )}`}
                    style={{
                      width: `${
                        stats.totalCases > 0
                          ? (stat.value / stats.totalCases) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <style jsx global>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
          }

          tr {
            transition: all 0.3s ease;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Update;
