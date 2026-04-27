import { useEffect, useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiExternalLink,
} from "react-icons/fi";
import { API_BASE } from "../../config/api";

const SearchCase = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCases();
  }, []);

  const [searchType, setSearchType] = useState("caseId");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    caseType: "",
    division: "",
  });

  const fetchCases = async () => {
    try {
      setLoading(true);
      const [reportsResponse, accReportsResponse] = await Promise.all([
        fetch(`${API_BASE}/reports`),
        fetch(`${API_BASE}/acc-form-reports`),
      ]);

      const [reportsResult, accReportsResult] = await Promise.all([
        reportsResponse.json(),
        accReportsResponse.json(),
      ]);

      const generalReports = reportsResult?.success
        ? reportsResult.data.map((report) => ({
            id: report._id,
            createdAt: report.createdAt,
            caseId:
              report.caseId ||
              `C-${new Date(report.createdAt).getFullYear()}-${report._id
                .slice(-6)
                .toUpperCase()}`,
            name: report.isAnonymous
              ? "Anonymous Report"
              : `State vs. ${report.name || "Unknown"}`,
            type: report.problemType,
            status: report.status,
            division: report.incidentDivision,
            description: report.description,
            address: report.incidentAddress,
            isAnonymous: report.isAnonymous,
            lastUpdate: new Date(report.createdAt).toLocaleDateString(),
            submittedAt: report.submittedAt,
            reporterInfo: report.isAnonymous
              ? null
              : {
                  name: report.name,
                  phone: report.phone,
                  address: report.address,
                },
          }))
        : [];

      const accReports = accReportsResult?.success
        ? accReportsResult.data.map((report) => ({
            id: report._id,
            createdAt: report.createdAt,
            caseId:
              report.referenceNumber ||
              `ACC-${new Date(report.createdAt).toISOString().slice(0, 10).replace(/-/g, "")}`,
            name: `State vs. ${report?.accused?.name || "Unknown"}`,
            type: report?.incident?.corruptionType || "Other",
            status: report.status,
            division: report?.incident?.division || "Unknown",
            description: report?.incident?.description || "",
            address: report?.incident?.location || "",
            isAnonymous: false,
            lastUpdate: new Date(report.createdAt).toLocaleDateString(),
            submittedAt: report.submittedAt,
            reporterInfo: report?.complainant
              ? {
                  name: report.complainant.fullName,
                  phone: report.complainant.mobile,
                  address: report.complainant.address,
                }
              : null,
          }))
        : [];

      const transformedCases = [...generalReports, ...accReports].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );

      setCases(transformedCases);

      if (!reportsResult?.success && !accReportsResult?.success) {
        setError("Failed to fetch cases");
      }
    } catch (err) {
      console.error("Error fetching cases:", err);
      setError("Error loading cases. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = cases.filter((caseItem) => {
    // Search filter
    let matchesSearch = true;
    if (searchTerm !== "") {
      if (searchType === "caseId") {
        matchesSearch =
          caseItem.caseId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          false;
      } else if (searchType === "name") {
        matchesSearch =
          caseItem.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          false;
      } else if (searchType === "type") {
        matchesSearch =
          caseItem.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          false;
      }
    }

    // Status filter
    const matchesStatus =
      filters.status === "" ||
      caseItem.status?.toLowerCase() === filters.status.toLowerCase();

    // Type filter
    const matchesType =
      filters.caseType === "" ||
      caseItem.type?.toLowerCase() === filters.caseType.toLowerCase();

    // Division filter
    const matchesDivision =
      filters.division === "" ||
      caseItem.division?.toLowerCase() === filters.division.toLowerCase();

    return matchesSearch && matchesStatus && matchesType && matchesDivision;
  });

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-800";

    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "under-review":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    if (!status) return "Unknown";

    switch (status.toLowerCase()) {
      case "pending":
        return "Pending Investigation";
      case "under-review":
        return "Under Review";
      case "resolved":
        return "Resolved";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };

  const getTypeColor = (type) => {
    if (!type) return "text-gray-700";

    switch (type.toLowerCase()) {
      case "bribery":
        return "text-orange-600";
      case "embezzlement":
        return "text-red-600";
      case "fraud":
        return "text-purple-600";
      case "nepotism":
        return "text-indigo-600";
      case "abuse of power":
        return "text-cyan-600";
      case "procurement corruption":
        return "text-pink-600";
      default:
        return "text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading cases...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={fetchCases}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Anti-Corruption Case Search
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Search and filter through corruption reports with our comprehensive
            database
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 transition-all duration-300 hover:shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
            <div className="w-full md:w-1/2">
              <h2 className="text-orange-700 font-bold mb-3 flex items-center">
                <FiSearch className="mr-2" />
                Search Cases
              </h2>
              <div className="flex border border-gray-300 rounded-xl overflow-hidden shadow-sm">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="bg-gray-100 text-gray-700 px-4 focus:outline-none"
                >
                  <option value="caseId">Case ID</option>
                  <option value="name">Case Name</option>
                  <option value="type">Case Type</option>
                </select>
                <input
                  type="text"
                  placeholder={
                    searchType === "caseId"
                      ? "Enter case ID (e.g. C-2023-ABC123)"
                      : searchType === "name"
                        ? "Enter case name"
                        : "Enter case type"
                  }
                  className="flex-1 p-4 focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="bg-orange-500 text-white px-6 hover:bg-orange-600 transition-colors">
                  <FiSearch className="text-xl" />
                </button>
              </div>
            </div>

            <div className="w-full md:w-1/2">
              <div className="flex justify-between items-center">
                <h2 className="text-orange-700 font-bold mb-3 flex items-center">
                  <FiFilter className="mr-2" />
                  Filtering Options
                </h2>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="text-orange-600 hover:text-orange-800 flex items-center"
                >
                  {isFilterOpen ? <FiChevronUp /> : <FiChevronDown />}
                </button>
              </div>

              {isFilterOpen && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl mt-3 animate-fade-in">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) =>
                        setFilters({ ...filters, status: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                    >
                      <option value="">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="under-review">Under Review</option>
                      <option value="resolved">Resolved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Case Type
                    </label>
                    <select
                      value={filters.caseType}
                      onChange={(e) =>
                        setFilters({ ...filters, caseType: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                    >
                      <option value="">All Types</option>
                      <option value="Bribery">Bribery</option>
                      <option value="Embezzlement">Embezzlement</option>
                      <option value="Fraud">Fraud</option>
                      <option value="Nepotism">Nepotism</option>
                      <option value="Abuse of Power">Abuse of Power</option>
                      <option value="Procurement Corruption">
                        Procurement Corruption
                      </option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Division
                    </label>
                    <select
                      value={filters.division}
                      onChange={(e) =>
                        setFilters({ ...filters, division: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                    >
                      <option value="">All Divisions</option>
                      <option value="Dhaka">Dhaka</option>
                      <option value="Chittagong">Chittagong</option>
                      <option value="Rajshahi">Rajshahi</option>
                      <option value="Khulna">Khulna</option>
                      <option value="Barishal">Barishal</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Rangpur">Rangpur</option>
                      <option value="Mymensingh">Mymensingh</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-right">
            <button
              onClick={() => {
                setSearchTerm("");
                setFilters({ status: "", caseType: "", division: "" });
              }}
              className="text-orange-600 hover:text-orange-800 text-sm"
            >
              Clear all filters
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <tr className="text-left">
                  <th className="py-4 px-6 font-bold text-lg">Case ID</th>
                  <th className="py-4 px-6 font-bold text-lg">Case Name</th>
                  <th className="py-4 px-6 font-bold text-lg">Type</th>
                  <th className="py-4 px-6 font-bold text-lg">Division</th>
                  <th className="py-4 px-6 font-bold text-lg">Status</th>
                  <th className="py-4 px-6 font-bold text-lg">Submitted</th>
                  <th className="py-4 px-6 font-bold text-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map((caseItem, index) => (
                  <tr
                    key={caseItem.id}
                    className={`border-b border-gray-200 hover:bg-orange-50 transition-colors duration-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="py-4 px-6 font-medium text-gray-900">
                      <span className="inline-block bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {caseItem.caseId}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">
                        {caseItem.name}
                      </div>
                      {caseItem.isAnonymous && (
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                          Anonymous
                        </span>
                      )}
                    </td>
                    <td
                      className={`py-4 px-6 font-medium ${getTypeColor(
                        caseItem.type,
                      )}`}
                    >
                      {caseItem.type}
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {caseItem.division}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          caseItem.status,
                        )}`}
                      >
                        {getStatusText(caseItem.status)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {caseItem.lastUpdate}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        className="flex items-center text-orange-600 hover:text-orange-800"
                        onClick={() => {
                          // You can implement a modal or navigate to details page
                          alert(
                            `Case Details:\n\nID: ${caseItem.caseId}\nType: ${caseItem.type}\nDivision: ${caseItem.division}\nStatus: ${caseItem.status}\n\nDescription: ${caseItem.description}`,
                          );
                        }}
                      >
                        <span>View Details</span>
                        <FiExternalLink className="ml-1" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCases.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-xl mb-4">
                No cases found matching your criteria
              </div>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilters({ status: "", caseType: "", division: "" });
                }}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Clear filters and try again
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-gray-600">
          <p>
            Showing {filteredCases.length} of {cases.length} cases
          </p>
          <p className="mt-2">
            For more information about a specific case, contact our legal
            department
          </p>
        </div>
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
          animation: fade-in 0.3s ease-out forwards;
        }

        tr {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default SearchCase;
