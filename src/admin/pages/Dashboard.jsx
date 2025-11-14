import React, { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingCases: 0,
    activeCases: 0,
    resolvedCases: 0,
    registeredUsers: 0,
  });

  const [breakdown, setBreakdown] = useState({
    byDivision: [],
    byType: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/dashboard/statistics`);
      const result = await response.json();

      if (result.success) {
        setStats(result.data.overview);
        setBreakdown(result.data.breakdown);
      } else {
        setError("Failed to fetch dashboard data");
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Error loading dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const statsConfig = [
    {
      title: "Total Reports",
      value: stats.totalReports,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Pending Cases",
      value: stats.pendingCases,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
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
      ),
      color: "bg-amber-100 text-amber-600",
    },
    {
      title: "Active Cases",
      value: stats.activeCases,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Resolved Cases",
      value: stats.resolvedCases,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Registered Users",
      value: stats.registeredUsers,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      color: "bg-indigo-100 text-indigo-600",
    },
  ];

  const getPercentage = (value, total) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  const caseDistribution = [
    {
      title: "Pending Cases",
      value: stats.pendingCases,
      color: "bg-amber-500",
      width: `${getPercentage(stats.pendingCases, stats.totalReports)}%`,
    },
    {
      title: "Active Cases",
      value: stats.activeCases,
      color: "bg-purple-500",
      width: `${getPercentage(stats.activeCases, stats.totalReports)}%`,
    },
    {
      title: "Resolved Cases",
      value: stats.resolvedCases,
      color: "bg-green-500",
      width: `${getPercentage(stats.resolvedCases, stats.totalReports)}%`,
    },
  ];

  if (loading) {
    return (
      <div className="pt-16 p-4 md:p-6 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 p-4 md:p-6 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold mb-2">Error Loading Dashboard</p>
          <p>{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 p-4 md:p-6 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Dashboard Overview
            </h1>
            <p className="text-gray-500 mt-2">Key metrics at a glance</p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {statsConfig.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 group"
            >
              <div className="flex justify-between items-start">
                <div
                  className={`${stat.color} p-3 rounded-lg group-hover:opacity-90 transition-opacity`}
                >
                  {stat.icon}
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  {stat.title}
                </h3>
                <div className="text-2xl font-bold text-gray-800">
                  {stat.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Case Distribution Visualization */}
        <div className="mt-10 bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Case Distribution
          </h3>

          <div className="flex flex-col sm:flex-row gap-6">
            {/* Progress Bars */}
            <div className="flex-1 space-y-4">
              {caseDistribution.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-600">
                      {item.title}
                    </span>
                    <span className="text-sm font-medium text-gray-800">
                      {item.value}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`${item.color} h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: item.width }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Donut Chart */}
            <div className="relative flex items-center justify-center">
              <div className="relative w-40 h-40">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full transform -rotate-90"
                >
                  {/* Calculate stroke dash offsets for donut chart */}
                  {(() => {
                    const total = stats.totalReports || 1;
                    const circumference = 283; // 2 * π * 45

                    const resolvedPercent = (stats.resolvedCases / total) * 100;
                    const activePercent = (stats.activeCases / total) * 100;
                    const pendingPercent = (stats.pendingCases / total) * 100;

                    const resolvedDash =
                      (resolvedPercent / 100) * circumference;
                    const activeDash = (activePercent / 100) * circumference;
                    const pendingDash = (pendingPercent / 100) * circumference;

                    let offset = 0;

                    return (
                      <>
                        {/* Resolved - Green */}
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="10"
                          strokeDasharray={`${resolvedDash} ${
                            circumference - resolvedDash
                          }`}
                          strokeDashoffset={offset}
                          className="transition-all duration-500"
                        />

                        {/* Active - Purple */}
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#8B5CF6"
                          strokeWidth="10"
                          strokeDasharray={`${activeDash} ${
                            circumference - activeDash
                          }`}
                          strokeDashoffset={offset - resolvedDash}
                          className="transition-all duration-500"
                        />

                        {/* Pending - Amber */}
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#F59E0B"
                          strokeWidth="10"
                          strokeDasharray={`${pendingDash} ${
                            circumference - pendingDash
                          }`}
                          strokeDashoffset={offset - resolvedDash - activeDash}
                          className="transition-all duration-500"
                        />
                      </>
                    );
                  })()}
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-gray-800">
                    {stats.totalReports}
                  </span>
                  <span className="text-sm text-gray-500">Total Cases</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Divisions */}
        {breakdown.byDivision.length > 0 && (
          <div className="mt-6 bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Top Reporting Divisions
            </h3>
            <div className="space-y-3">
              {breakdown.byDivision.slice(0, 5).map((division, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-semibold text-sm mr-3">
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-700">
                      {division.division}
                    </span>
                  </div>
                  <span className="text-gray-600 font-semibold">
                    {division.count} cases
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Corruption Types */}
        {breakdown.byType.length > 0 && (
          <div className="mt-6 bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Corruption Types
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {breakdown.byType.map((type, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 capitalize">
                    {type.type}
                  </p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {type.count}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
