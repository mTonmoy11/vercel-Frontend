import React, { useState, useEffect } from "react";
import {
  FiMap,
  FiBarChart2,
  FiAward,
  FiAlertTriangle,
  FiTrendingUp,
  FiCheckCircle,
  FiActivity,
  FiRefreshCw,
} from "react-icons/fi";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function ManageHeatmap() {
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalReported: 0,
    totalSolved: 0,
    totalActive: 0,
    highestReported: { division: "", count: 0 },
    highestSolved: { division: "", count: 0 },
    divisionData: [],
  });

  // Fetch real data from backend
  useEffect(() => {
    fetchHeatmapData();
  }, []);

  const fetchHeatmapData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/heatmap/statistics`);
      const result = await response.json();

      if (result.success) {
        setStats(result.data);
        setHeatmapData(result.data.divisionData);
      } else {
        setError("Failed to fetch heatmap data");
      }
    } catch (err) {
      console.error("Error fetching heatmap data:", err);
      setError("Error loading heatmap data");
    } finally {
      setLoading(false);
    }
  };

  const getPercentage = (value, total) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  const getBarWidth = (value, max) => {
    return max > 0 ? Math.round((value / max) * 100) : 0;
  };

  const getMaxReported = () => {
    return Math.max(...heatmapData.map((item) => item.reportedCases), 1);
  };

  const getMaxSolved = () => {
    return Math.max(...heatmapData.map((item) => item.solvedCases), 1);
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
          <button
            onClick={fetchHeatmapData}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center mb-4 md:mb-0">
          <FiMap className="mr-3 text-orange-500" />
          Corruption Heatmap Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600 bg-orange-50 p-3 rounded-lg">
            <FiActivity className="inline mr-2 text-orange-500" />
            Data updates automatically from reports and cases
          </div>
          <button
            onClick={fetchHeatmapData}
            className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors flex items-center"
          >
            <FiRefreshCw className="mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-500 font-medium">
                Total Reported Cases
              </h3>
              <p className="text-3xl font-bold mt-2">{stats.totalReported}</p>
              <p className="text-sm text-gray-500 mt-1">Across all divisions</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FiAlertTriangle className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-500 font-medium">Total Solved Cases</h3>
              <p className="text-3xl font-bold mt-2">{stats.totalSolved}</p>
              <div className="mt-1">
                <span className="text-sm text-gray-500">
                  {getPercentage(stats.totalSolved, stats.totalReported)}% of
                  total
                </span>
              </div>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FiCheckCircle className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-orange-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-500 font-medium">Total Active Cases</h3>
              <p className="text-3xl font-bold mt-2">{stats.totalActive}</p>
              <div className="mt-1">
                <span className="text-sm text-gray-500">
                  {getPercentage(stats.totalActive, stats.totalReported)}% of
                  total
                </span>
              </div>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <FiTrendingUp className="text-orange-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center mb-4">
            <FiAlertTriangle className="text-blue-600 mr-3 text-xl" />
            <h3 className="text-lg font-bold text-gray-800">
              Highest Reported Cases
            </h3>
          </div>
          <div className="flex items-end">
            <div className="text-4xl font-bold text-blue-600">
              {stats.highestReported.count}
            </div>
            <div className="ml-4">
              <div className="text-xl font-semibold">
                {stats.highestReported.division || "N/A"}
              </div>
              <p className="text-sm text-gray-600">
                {stats.highestReported.count > 0
                  ? `${getPercentage(
                      stats.highestReported.count,
                      stats.totalReported
                    )}% of national total`
                  : "No data available"}
              </p>
            </div>
          </div>
          {stats.highestReported.count > 0 && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{
                    width: `${getPercentage(
                      stats.highestReported.count,
                      stats.totalReported
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center mb-4">
            <FiAward className="text-green-600 mr-3 text-xl" />
            <h3 className="text-lg font-bold text-gray-800">
              Highest Solved Cases
            </h3>
          </div>
          <div className="flex items-end">
            <div className="text-4xl font-bold text-green-600">
              {stats.highestSolved.count}
            </div>
            <div className="ml-4">
              <div className="text-xl font-semibold">
                {stats.highestSolved.division || "N/A"}
              </div>
              <p className="text-sm text-gray-600">
                {stats.highestSolved.count > 0
                  ? `${getPercentage(
                      stats.highestSolved.count,
                      stats.totalSolved
                    )}% of national solved`
                  : "No data available"}
              </p>
            </div>
          </div>
          {stats.highestSolved.count > 0 && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-green-600 h-2.5 rounded-full"
                  style={{
                    width: `${getPercentage(
                      stats.highestSolved.count,
                      stats.totalSolved
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Heatmap Table */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h2 className="text-xl font-bold text-gray-800 flex items-center mb-4 md:mb-0">
            <FiBarChart2 className="mr-3 text-orange-500" />
            Division-wise Corruption Statistics
          </h2>
          <div className="text-sm text-gray-500">
            Data updated: {new Date().toLocaleDateString()}
          </div>
        </div>

        <div className="overflow-x-auto">
          {heatmapData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No data available yet. Cases will appear here once reported.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Division
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reported Cases
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Solved Cases
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Active Cases
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resolution Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {heatmapData.map((division) => {
                  const resolutionRate = getPercentage(
                    division.solvedCases,
                    division.reportedCases
                  );
                  const maxReported = getMaxReported();
                  const maxSolved = getMaxSolved();

                  return (
                    <tr
                      key={division.division}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {division.division}
                      </td>

                      {/* Reported Cases */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-700 font-medium">
                          {division.reportedCases}
                        </div>
                        {division.reportedCases > 0 && (
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${getBarWidth(
                                  division.reportedCases,
                                  maxReported
                                )}%`,
                              }}
                            ></div>
                          </div>
                        )}
                      </td>

                      {/* Solved Cases */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-700 font-medium">
                          {division.solvedCases}
                        </div>
                        {division.solvedCases > 0 && (
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{
                                width: `${getBarWidth(
                                  division.solvedCases,
                                  maxSolved
                                )}%`,
                              }}
                            ></div>
                          </div>
                        )}
                      </td>

                      {/* Active Cases */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-700 font-medium">
                          {division.activeCases}
                        </div>
                        {division.activeCases > 0 && (
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className="bg-orange-600 h-2 rounded-full"
                              style={{
                                width: `${getBarWidth(
                                  division.activeCases,
                                  maxReported
                                )}%`,
                              }}
                            ></div>
                          </div>
                        )}
                      </td>

                      {/* Resolution Rate */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`font-medium ${
                            resolutionRate >= 60
                              ? "text-green-600"
                              : resolutionRate >= 40
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {resolutionRate}%
                        </div>
                        {division.reportedCases > 0 && (
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className={`h-2 rounded-full ${
                                resolutionRate >= 60
                                  ? "bg-green-600"
                                  : resolutionRate >= 40
                                  ? "bg-yellow-600"
                                  : "bg-red-600"
                              }`}
                              style={{ width: `${resolutionRate}%` }}
                            ></div>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageHeatmap;
