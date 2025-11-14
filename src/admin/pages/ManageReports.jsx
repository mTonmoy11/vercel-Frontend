import React, { useState, useEffect } from "react";
import {
  FiEye,
  FiUser,
  FiFileText,
  FiClock,
  FiX,
  FiCheck,
  FiUserCheck,
  FiUserX,
  FiAward,
  FiRefreshCw,
} from "react-icons/fi";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function ManageReports() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [rewardMessage, setRewardMessage] = useState("");
  const [rewardAmount, setRewardAmount] = useState("");
  const [selectedReportForReward, setSelectedReportForReward] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/reports`);
      const data = await response.json();

      if (data.success) {
        const transformedReports = data.data.map((report) => ({
          id: report._id,
          type: report.problemType,
          description: report.description,
          isAnonymous: report.isAnonymous,
          user: report.isAnonymous
            ? null
            : {
                name: report.name,
                phone: report.phone,
                address: report.address,
                userId: report.userId,
              },
          division: report.incidentDivision,
          incidentAddress: report.incidentAddress,
          status: report.status,
          createdAt: report.createdAt,
          submittedAt: report.submittedAt,
          eligibleForReward: report.eligibleForReward || false,
          rewarded: report.rewarded || false,
          rewardAmount: report.rewardAmount || null,
          rewardMessage: report.rewardMessage || "",
          rewardedAt: report.rewardedAt || null,
          adminNotes: report.adminNotes || "",
        }));
        setReports(transformedReports);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      alert("Failed to load reports. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredReports =
    statusFilter === "all"
      ? reports
      : reports.filter((report) => report.status === statusFilter);

  const openReportDetails = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  const openRewardModal = (report) => {
    setSelectedReportForReward(report);
    setIsRewardModalOpen(true);
    setRewardMessage("");
    setRewardAmount("");
  };

  const closeRewardModal = () => {
    setIsRewardModalOpen(false);
    setSelectedReportForReward(null);
    setRewardMessage("");
    setRewardAmount("");
  };

  const handleRewardSubmit = async () => {
    if (!selectedReportForReward || !rewardMessage.trim()) {
      alert("Please enter reward details");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/reports/${selectedReportForReward.id}/reward`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rewardAmount: rewardAmount ? parseFloat(rewardAmount) : null,
            rewardMessage: rewardMessage,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to process reward");
      }

      // Update local state
      const updatedReports = reports.map((report) =>
        report.id === selectedReportForReward.id
          ? {
              ...report,
              rewarded: true,
              rewardAmount: rewardAmount ? parseFloat(rewardAmount) : null,
              rewardMessage: rewardMessage,
              rewardedAt: new Date().toISOString(),
            }
          : report
      );

      setReports(updatedReports);

      // Update selected report if modal is open
      if (selectedReport?.id === selectedReportForReward.id) {
        setSelectedReport({
          ...selectedReport,
          rewarded: true,
          rewardAmount: rewardAmount ? parseFloat(rewardAmount) : null,
          rewardMessage: rewardMessage,
          rewardedAt: new Date().toISOString(),
        });
      }

      alert("Reward processed successfully!");
      closeRewardModal();
    } catch (error) {
      console.error("Error processing reward:", error);
      alert(error.message || "Failed to process reward. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
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
    switch (status) {
      case "pending":
        return "Pending";
      case "under-review":
        return "Under Review";
      case "resolved":
        return "Resolved";
      case "rejected":
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  const updateReportStatus = async (newStatus) => {
    if (!selectedReport) return;

    setUpdatingStatus(true);

    try {
      const response = await fetch(`${API_BASE}/reports/${selectedReport.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update status");
      }

      // Update local reports array
      const updatedReports = reports.map((report) =>
        report.id === selectedReport.id
          ? { ...report, status: newStatus }
          : report
      );

      setReports(updatedReports);

      // Update selected report in modal
      setSelectedReport({ ...selectedReport, status: newStatus });

      console.log("Status updated to:", newStatus);

      // Close modal if resolved or rejected
      if (newStatus === "resolved" || newStatus === "rejected") {
        setTimeout(() => {
          closeModal();
        }, 1000);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert(error.message || "Failed to update status. Please try again.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center mb-4 md:mb-0">
            <FiFileText className="mr-3 text-orange-500" />
            Manage Corruption Reports
            <span className="ml-3 text-sm bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
              {reports.length} Total
            </span>
          </h1>

          <div className="flex space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Reports</option>
              <option value="pending">Pending</option>
              <option value="under-review">Under Review</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>

            <button
              onClick={fetchReports}
              className="p-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors flex items-center"
              title="Refresh reports"
            >
              <FiRefreshCw className="mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-sm text-yellow-600 font-medium">Pending</p>
            <p className="text-2xl font-bold text-yellow-800">
              {reports.filter((r) => r.status === "pending").length}
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-600 font-medium">Under Review</p>
            <p className="text-2xl font-bold text-blue-800">
              {reports.filter((r) => r.status === "under-review").length}
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-sm text-green-600 font-medium">Resolved</p>
            <p className="text-2xl font-bold text-green-800">
              {reports.filter((r) => r.status === "resolved").length}
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <p className="text-sm text-purple-600 font-medium">Rewarded</p>
            <p className="text-2xl font-bold text-purple-800">
              {reports.filter((r) => r.rewarded).length}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reporter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Division
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center">
                      <FiFileText className="text-4xl text-gray-300 mb-2" />
                      <p>No reports found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900 text-xs">
                        {report.id.slice(-8)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">
                        {report.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 max-w-xs">
                      <p className="truncate text-sm">{report.description}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {report.isAnonymous ? (
                        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center w-fit">
                          <FiUserX className="mr-1" />
                          Anonymous
                        </span>
                      ) : (
                        <div>
                          <p className="text-blue-600 font-medium text-sm">
                            {report.user?.name}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {report.user?.phone}
                          </p>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {report.division}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          report.status
                        )}`}
                      >
                        {getStatusText(report.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openReportDetails(report)}
                          className="bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors px-3 py-2 rounded-xl flex items-center"
                          title="View details"
                        >
                          <FiEye className="mr-1" />
                          <span className="hidden sm:inline">Details</span>
                        </button>

                        {!report.isAnonymous &&
                          report.eligibleForReward &&
                          (report.rewarded ? (
                            <span
                              className="bg-green-100 text-green-700 px-3 py-2 rounded-xl flex items-center cursor-default"
                              title={`Rewarded on ${new Date(
                                report.rewardedAt
                              ).toLocaleDateString()}`}
                            >
                              <FiCheck className="mr-1" />
                              <span className="hidden sm:inline">Rewarded</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => openRewardModal(report)}
                              className="bg-green-100 text-green-700 hover:bg-green-200 transition-colors px-3 py-2 rounded-xl flex items-center"
                              title="Send reward"
                            >
                              <FiAward className="mr-1" />
                              <span className="hidden sm:inline">Reward</span>
                            </button>
                          ))}

                        {report.isAnonymous && (
                          <span className="bg-gray-100 text-gray-500 px-3 py-2 rounded-xl flex items-center cursor-not-allowed">
                            <FiUserX className="mr-1" />
                            <span className="hidden sm:inline">N/A</span>
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Details Modal */}
      {isModalOpen && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white flex justify-between items-center">
              <h2 className="text-xl md:text-2xl font-bold">
                Report Details
                <span
                  className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    selectedReport.status
                  )}`}
                >
                  {getStatusText(selectedReport.status)}
                </span>
              </h2>
              <button
                onClick={closeModal}
                className="text-white hover:text-gray-200"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                    <FiFileText className="mr-2 text-orange-500" />
                    Report Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Report ID</p>
                      <p className="font-medium text-xs">{selectedReport.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="font-medium">{selectedReport.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Division</p>
                      <p className="font-medium">{selectedReport.division}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Incident Address</p>
                      <p className="font-medium">
                        {selectedReport.incidentAddress}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Submitted</p>
                      <p className="font-medium flex items-center">
                        <FiClock className="mr-2" />
                        {new Date(selectedReport.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                    <FiUser className="mr-2 text-orange-500" />
                    Reporter Information
                  </h3>
                  {selectedReport.isAnonymous ? (
                    <div className="text-center py-4">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                        <FiUserX className="text-gray-400 text-2xl" />
                      </div>
                      <p className="font-medium text-gray-800">
                        Anonymous Report
                      </p>
                      <p className="text-sm text-gray-500">
                        No personal information available
                      </p>
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-xs text-yellow-700">
                          <FiAward className="inline mr-1" />
                          Not eligible for rewards
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium">
                          {selectedReport.user?.name || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">
                          {selectedReport.user?.phone || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium">
                          {selectedReport.user?.address || "N/A"}
                        </p>
                      </div>
                      {selectedReport.rewarded && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-xs text-green-700 font-semibold mb-1">
                            <FiCheck className="inline mr-1" />
                            Reward Sent
                          </p>
                          {selectedReport.rewardAmount && (
                            <p className="text-xs text-green-600">
                              Amount: ৳{selectedReport.rewardAmount}
                            </p>
                          )}
                          {selectedReport.rewardMessage && (
                            <p className="text-xs text-gray-600 mt-1">
                              {selectedReport.rewardMessage}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(
                              selectedReport.rewardedAt
                            ).toLocaleString()}
                          </p>
                        </div>
                      )}
                      {!selectedReport.rewarded &&
                        selectedReport.eligibleForReward && (
                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-xs text-blue-700">
                              <FiAward className="inline mr-1" />
                              Eligible for rewards
                            </p>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-bold text-gray-800 mb-3">Description</h3>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <p className="text-gray-700 whitespace-pre-line">
                    {selectedReport.description}
                  </p>
                </div>
              </div>

              {/* Status Update Section */}
              <div className="mt-8 mb-6">
                <h3 className="font-bold text-gray-800 mb-4">
                  Update Report Status
                </h3>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => updateReportStatus("pending")}
                    disabled={
                      selectedReport.status === "pending" || updatingStatus
                    }
                    className={`px-6 py-3 rounded-xl font-medium flex items-center transition-all ${
                      selectedReport.status === "pending"
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    }`}
                  >
                    {updatingStatus && selectedReport.status !== "pending" ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-yellow-600 mr-2"></div>
                    ) : (
                      <FiClock className="mr-2" />
                    )}
                    Mark as Pending
                  </button>

                  <button
                    onClick={() => updateReportStatus("under-review")}
                    disabled={
                      selectedReport.status === "under-review" || updatingStatus
                    }
                    className={`px-6 py-3 rounded-xl font-medium flex items-center transition-all ${
                      selectedReport.status === "under-review"
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                    }`}
                  >
                    {updatingStatus &&
                    selectedReport.status !== "under-review" ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-600 mr-2"></div>
                    ) : (
                      <FiUserCheck className="mr-2" />
                    )}
                    Under Review
                  </button>

                  <button
                    onClick={() => updateReportStatus("resolved")}
                    disabled={
                      selectedReport.status === "resolved" || updatingStatus
                    }
                    className={`px-6 py-3 rounded-xl font-medium flex items-center transition-all ${
                      selectedReport.status === "resolved"
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-green-100 text-green-800 hover:bg-green-200"
                    }`}
                  >
                    {updatingStatus && selectedReport.status !== "resolved" ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-green-600 mr-2"></div>
                    ) : (
                      <FiCheck className="mr-2" />
                    )}
                    Mark as Resolved
                  </button>

                  <button
                    onClick={() => updateReportStatus("rejected")}
                    disabled={
                      selectedReport.status === "rejected" || updatingStatus
                    }
                    className={`px-6 py-3 rounded-xl font-medium flex items-center transition-all ${
                      selectedReport.status === "rejected"
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    }`}
                  >
                    {updatingStatus && selectedReport.status !== "rejected" ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-red-600 mr-2"></div>
                    ) : (
                      <FiUserX className="mr-2" />
                    )}
                    Reject Report
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reward Modal */}
      {isRewardModalOpen && selectedReportForReward && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white flex justify-between items-center">
              <h2 className="text-xl md:text-2xl font-bold">
                <FiAward className="inline mr-3" />
                Reward Reporter
              </h2>
              <button
                onClick={closeRewardModal}
                className="text-white hover:text-gray-200"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-3">
                  Report Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Report ID</p>
                      <p className="font-medium text-xs">
                        {selectedReportForReward.id}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Report Type</p>
                      <p className="font-medium">
                        {selectedReportForReward.type}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Reporter</p>
                      <p className="font-medium">
                        {selectedReportForReward.user?.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact</p>
                      <p className="font-medium">
                        {selectedReportForReward.user?.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6 space-y-4">
                <h3 className="font-bold text-gray-800">Reward Details</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reward Amount (Optional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      ৳
                    </span>
                    <input
                      type="number"
                      value={rewardAmount}
                      onChange={(e) => setRewardAmount(e.target.value)}
                      className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter amount"
                      min="0"
                      step="100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reward Message *
                  </label>
                  <textarea
                    value={rewardMessage}
                    onChange={(e) => setRewardMessage(e.target.value)}
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter the reward details or message for the reporter..."
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={closeRewardModal}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRewardSubmit}
                  disabled={!rewardMessage.trim()}
                  className={`px-6 py-2 rounded-xl font-medium flex items-center ${
                    !rewardMessage.trim()
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  <FiAward className="mr-2" />
                  Send Reward
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageReports;
