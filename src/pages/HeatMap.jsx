import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const HeatMap = () => {
  const [activeRegion, setActiveRegion] = useState(null);
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize scroll position
    window.scrollTo(0, 0);

    // Fetch reports from backend
    fetchHeatmapData();
  }, []);

  const fetchHeatmapData = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/reports");
      const result = await response.json();

      if (result.success) {
        // Process the data to group by division
        const divisionStats = processReportsByDivision(result.data);
        setHeatmapData(divisionStats);
      } else {
        setError("Failed to fetch reports");
      }
    } catch (err) {
      console.error("Error fetching heatmap data:", err);
      setError("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  const processReportsByDivision = (reports) => {
    const divisions = [
      "Dhaka",
      "Chittagong",
      "Rajshahi",
      "Khulna",
      "Barishal",
      "Sylhet",
      "Rangpur",
      "Mymensingh",
    ];

    const divisionData = divisions.map((division) => {
      const divisionReports = reports.filter(
        (report) => report.incidentDivision === division
      );

      const totalReports = divisionReports.length;
      const resolvedReports = divisionReports.filter(
        (report) => report.status === "resolved"
      ).length;
      const pendingReports = divisionReports.filter(
        (report) => report.status === "pending"
      ).length;
      const underReviewReports = divisionReports.filter(
        (report) => report.status === "under-review"
      ).length;
      const activeReports = pendingReports + underReviewReports;

      return {
        name: division,
        uv: totalReports, // Total reported cases
        pv: resolvedReports, // Resolved cases
        amt: activeReports, // Active cases (pending + under review)
      };
    });

    return divisionData;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const resolutionRate =
        payload[0].value > 0
          ? ((payload[1].value / payload[0].value) * 100).toFixed(1)
          : 0;

      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <p className="font-bold text-gray-800">{label}</p>
          <div className="mt-2 space-y-1">
            <p className="text-blue-600">
              Reported Cases:{" "}
              <span className="font-bold">{payload[0].value}</span>
            </p>
            <p className="text-green-600">
              Resolved Cases:{" "}
              <span className="font-bold">{payload[1].value}</span>
            </p>
            <p className="text-purple-600">
              Active Cases:{" "}
              <span className="font-bold">{payload[2].value}</span>
            </p>
            <p className="text-gray-600 text-sm border-t pt-1 mt-1">
              Resolution Rate:{" "}
              <span className="font-bold">{resolutionRate}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const getHighestResolutionDivision = () => {
    if (heatmapData.length === 0) return { name: "N/A", rate: 0 };

    const withRate = heatmapData
      .filter((d) => d.uv > 0)
      .map((d) => ({
        name: d.name,
        rate: ((d.pv / d.uv) * 100).toFixed(1),
      }))
      .sort((a, b) => b.rate - a.rate);

    return withRate.length > 0 ? withRate[0] : { name: "N/A", rate: 0 };
  };

  const getMostActiveDivision = () => {
    if (heatmapData.length === 0) return { name: "N/A", count: 0 };

    const sorted = [...heatmapData].sort((a, b) => b.amt - a.amt);
    return { name: sorted[0].name, count: sorted[0].amt };
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading heatmap data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={fetchHeatmapData}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const highestResolution = getHighestResolutionDivision();
  const mostActive = getMostActiveDivision();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-xl p-6 mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Corruption Heatmap in Bangladesh
            </h2>
            <p className="text-gray-600 mt-2">
              Distribution of corruption cases across different regions
            </p>
          </div>
          <div className="mt-4 md:mt-0 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-full text-sm">
            Updated: {new Date().toLocaleDateString()}
          </div>
        </div>

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={heatmapData}
              margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
              onMouseMove={(state) => {
                if (state.activeTooltipIndex !== undefined) {
                  setActiveRegion(heatmapData[state.activeTooltipIndex]);
                }
              }}
              onMouseLeave={() => setActiveRegion(null)}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ffc658" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e0e0e0"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: "#555" }}
                axisLine={false}
                tickLine={false}
                padding={{ left: 20, right: 20 }}
              />
              <YAxis
                tick={{ fill: "#555" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="uv"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorUv)"
                activeDot={{
                  r: 8,
                  stroke: "#8884d8",
                  strokeWidth: 2,
                  fill: "#fff",
                }}
              />
              <Area
                type="monotone"
                dataKey="pv"
                stroke="#82ca9d"
                fillOpacity={1}
                fill="url(#colorPv)"
              />
              <Area
                type="monotone"
                dataKey="amt"
                stroke="#ffc658"
                fillOpacity={1}
                fill="url(#colorAmt)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Region Information */}
      {activeRegion && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              {activeRegion.name} Region
            </h3>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {activeRegion.uv > 50
                ? "High Activity"
                : activeRegion.uv > 20
                ? "Medium Activity"
                : "Low Activity"}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-600 font-medium">Reported Cases</p>
              <p className="text-2xl font-bold text-gray-800">
                {activeRegion.uv}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Total corruption reports
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-600 font-medium">Resolved Cases</p>
              <p className="text-2xl font-bold text-gray-800">
                {activeRegion.pv}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Cases successfully resolved
              </p>
              <p className="text-xs text-green-700 mt-1 font-semibold">
                {activeRegion.uv > 0
                  ? `${((activeRegion.pv / activeRegion.uv) * 100).toFixed(
                      1
                    )}% resolution rate`
                  : "0% resolution rate"}
              </p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg">
              <p className="text-amber-600 font-medium">Active Cases</p>
              <p className="text-2xl font-bold text-gray-800">
                {activeRegion.amt}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Currently under investigation
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-8 mb-8">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-[#8884d8] rounded mr-2"></div>
          <span className="text-gray-700">Reported Cases</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-[#82ca9d] rounded mr-2"></div>
          <span className="text-gray-700">Resolved Cases</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-[#ffc658] rounded mr-2"></div>
          <span className="text-gray-700">Active Cases</span>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-indigo-700 mb-2">
              Highest Resolution Rate
            </h4>
            <p className="text-gray-700">
              <span className="font-bold">{highestResolution.name}</span> region
              shows the highest case resolution rate at
              <span className="font-bold text-green-600">
                {" "}
                {highestResolution.rate}%
              </span>
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-indigo-700 mb-2">
              Most Active Region
            </h4>
            <p className="text-gray-700">
              <span className="font-bold">{mostActive.name}</span> has the
              highest number of active cases with
              <span className="font-bold text-amber-600">
                {" "}
                {mostActive.count}
              </span>{" "}
              cases currently under investigation
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default HeatMap;
