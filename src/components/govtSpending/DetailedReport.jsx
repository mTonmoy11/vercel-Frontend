import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiDownload, FiPrinter, FiSearch } from "react-icons/fi";
import { API_BASE, API_ENDPOINTS } from "../../config/api";

const DetailedReport = () => {
  // Show from top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [yearFilter, setYearFilter] = useState(
    new Date().getFullYear().toString()
  );
  const [availableYears, setAvailableYears] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [budgetData, setBudgetData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch budget data from API
  useEffect(() => {
    fetchBudgetData();
    fetchYearlyData();
  }, []);

  // Refetch when year filter changes
  useEffect(() => {
    fetchBudgetData();
  }, [yearFilter]);

  const fetchBudgetData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.GOVT_SPENDING);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch data");
      }

      if (result.success && result.data) {
        // Extract unique years from data
        const years = [
          ...new Set(
            result.data.map(
              (item) => item.year || new Date().getFullYear().toString()
            )
          ),
        ];
        const sortedYears = years.sort((a, b) => b.localeCompare(a)); // Sort descending
        setAvailableYears(sortedYears);

        // If no year filter is set, set it to the most recent year
        if (!yearFilter && sortedYears.length > 0) {
          setYearFilter(sortedYears[0]);
        }

        // Filter data by selected year
        const filteredByYear = result.data.filter(
          (item) =>
            item.year === yearFilter ||
            (!item.year && yearFilter === new Date().getFullYear().toString())
        );

        // Transform API data to match chart format
        const transformedData = filteredByYear.map((item) => ({
          name: item.name,
          budget: Number(item.budget),
          actual: Number(item.actual),
          variance: Number(item.actual) - Number(item.budget),
          color: item.color || "#003f5c",
          year: item.year || new Date().getFullYear().toString(),
        }));

        setBudgetData(transformedData);
      }
    } catch (err) {
      console.error("Error fetching budget data:", err);
      setError(err.message || "Failed to load budget data");
      setBudgetData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch yearly comparison data
  const fetchYearlyData = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GOVT_SPENDING_YEARLY);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch yearly data");
      }

      if (result.success && result.data) {
        setYearlyData(result.data);
      }
    } catch (err) {
      console.error("Error fetching yearly data:", err);
      // Fallback to current year data if yearly data fetch fails
      const currentYear = new Date().getFullYear().toString();
      setYearlyData([
        {
          year: currentYear,
          budget: budgetData.reduce((sum, item) => sum + item.budget, 0),
          actual: budgetData.reduce((sum, item) => sum + item.actual, 0),
        },
      ]);
    }
  };

  // Department spending data - derived from budgetData
  const departmentSpending = budgetData.map((item, index) => ({
    department: `Ministry of ${item.name}`,
    budget: item.budget,
    spent: item.actual,
    projects: Math.floor(Math.random() * 15) + 5, // Random for now
  }));

  // Filter data based on user selections
  const filteredData = budgetData.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDepartment =
      departmentFilter === "All" || item.name === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  // Calculate totals
  const totalBudget = budgetData.reduce((sum, item) => sum + item.budget, 0);
  const totalActual = budgetData.reduce((sum, item) => sum + item.actual, 0);
  const totalVariance = totalActual - totalBudget;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading budget data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchBudgetData}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (budgetData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <div className="text-gray-400 text-5xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No Data Available
          </h2>
          <p className="text-gray-600">
            No government spending data found. Please add budget items first.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="text-Black shadow-lg bg-gradient-to-b from-orange-500 to-gray-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Government Budget Allocation Report
                </h1>
                <p className="text-black-200">
                  Detailed analysis of public spending and budget utilization
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fiscal Year
              </label>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {availableYears.length > 0 ? (
                  availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))
                ) : (
                  <option value={new Date().getFullYear().toString()}>
                    {new Date().getFullYear()}
                  </option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="All">All Departments</option>
                {budgetData.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Budget Items
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search departments or projects..."
                  className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Year filter info */}
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="text-gray-600">
              Showing data for fiscal year:{" "}
              <span className="font-semibold text-blue-600">{yearFilter}</span>
            </div>
            <div className="text-gray-500">
              {budgetData.length} sector{budgetData.length !== 1 ? "s" : ""} in{" "}
              {yearFilter}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Total Budget
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              ${totalBudget.toLocaleString()}
            </p>
            <div className="mt-2 flex items-center">
              <span className="text-green-500 mr-1">●</span>
              <span className="text-gray-600">Approved for {yearFilter}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Actual Spending
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              ${totalActual.toLocaleString()}
            </p>
            <div className="mt-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  totalVariance >= 0
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {totalVariance >= 0 ? "+" : ""}
                {totalVariance.toLocaleString()} (
                {totalBudget > 0
                  ? ((totalVariance / totalBudget) * 100).toFixed(1)
                  : "0.0"}
                %)
              </span>
              <span className="text-gray-600 ml-2">vs Budget</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Budget Utilization
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {totalBudget > 0
                ? ((totalActual / totalBudget) * 100).toFixed(1)
                : "0.0"}
              %
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
              <div
                className="bg-purple-600 h-2.5 rounded-full"
                style={{
                  width: `${
                    totalBudget > 0
                      ? Math.min((totalActual / totalBudget) * 100, 100)
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Budget vs Actual Bar Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Budget vs Actual Spending ({yearFilter})
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`$${value.toLocaleString()}`, ""]}
                  />
                  <Legend />
                  <Bar dataKey="budget" name="Budget" fill="#4f46e5" />
                  <Bar dataKey="actual" name="Actual" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Budget Allocation Pie Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Budget Allocation by Sector
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={filteredData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="budget"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {filteredData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`$${value.toLocaleString()}`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Yearly Comparison */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Yearly Budget Comparison
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={yearlyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`$${value.toLocaleString()}`, ""]}
                />
                <Legend />
                <Bar dataKey="budget" name="Budget" fill="#4f46e5" />
                <Bar dataKey="actual" name="Actual" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Spending Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800">
              Detailed Department Spending
            </h3>
            <p className="text-gray-600">
              Breakdown of budget allocation and utilization by department
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Department
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Budget
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Spent
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Variance
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Utilization
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Projects
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {departmentSpending.map((dept, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {dept.department}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${dept.budget.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${dept.spent.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm ${
                          dept.spent - dept.budget >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        ${(dept.spent - dept.budget).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
                          <div
                            className="h-2.5 rounded-full"
                            style={{
                              width: `${
                                dept.budget > 0
                                  ? Math.min(
                                      (dept.spent / dept.budget) * 100,
                                      100
                                    )
                                  : 0
                              }%`,
                              backgroundColor:
                                budgetData[index % budgetData.length]?.color ||
                                "#4f46e5",
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {dept.budget > 0
                            ? ((dept.spent / dept.budget) * 100).toFixed(1)
                            : "0.0"}
                          %
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {dept.projects}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insights Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-blue-700 mb-2">
                Top Performing Departments
              </h4>
              <ul className="space-y-2">
                {budgetData
                  .filter((item) => item.actual > item.budget)
                  .sort((a, b) => b.actual / b.budget - a.actual / a.budget)
                  .slice(0, 3)
                  .map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{item.name}</span>
                      <span className="font-medium">
                        {item.budget > 0
                          ? ((item.actual / item.budget) * 100).toFixed(0)
                          : "0"}
                        % utilization
                      </span>
                    </li>
                  ))}
              </ul>
              {budgetData.filter((item) => item.actual > item.budget).length ===
                0 && (
                <p className="text-sm text-gray-500">
                  No departments over budget
                </p>
              )}
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-blue-700 mb-2">
                Areas for Improvement
              </h4>
              <ul className="space-y-2">
                {budgetData
                  .filter((item) => item.actual < item.budget)
                  .sort((a, b) => a.actual / a.budget - b.actual / b.budget)
                  .slice(0, 3)
                  .map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{item.name}</span>
                      <span className="font-medium">
                        {item.budget > 0
                          ? ((item.actual / item.budget) * 100).toFixed(0)
                          : "0"}
                        % utilization
                      </span>
                    </li>
                  ))}
              </ul>
              {budgetData.filter((item) => item.actual < item.budget).length ===
                0 && (
                <p className="text-sm text-gray-500">
                  All departments meeting budget targets
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedReport;
