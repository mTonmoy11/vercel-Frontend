import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const UserDashboard = () => {
  const { user, adminUser, isAdmin, authReady, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Debug (remove later)
  console.log("UserDashboard auth:", {
    authReady,
    isAuthenticated,
    user,
    adminUser,
    isAdmin,
  });

  // Resolve email from user or adminUser
  const userEmail = useMemo(
    () =>
      user?.email || user?.providerData?.[0]?.email || adminUser?.email || "",
    [user, adminUser],
  );

  const [profile, setProfile] = useState(null);
  const [profileData, setProfileData] = useState({});
  const [reports, setReports] = useState([]);
  const [accReports, setAccReports] = useState([]);
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    resolvedReports: 0,
    underReviewReports: 0,
  });

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authReady || !userEmail) {
      setLoadingProfile(false);
      setLoadingReports(false);
      return;
    }

    const loadProfile = async () => {
      setLoadingProfile(true);
      setError("");
      try {
        const res = await fetch(
          `${API_BASE}/api/registration/by-email/${encodeURIComponent(
            userEmail,
          )}`,
        );

        if (!res.ok) {
          throw new Error("Failed to load profile");
        }

        const data = await res.json();
        console.log("Profile loaded:", data);

        const p = data || {};
        setProfile(p);
        setProfileData({
          name: p.name || user?.displayName || adminUser?.name || "",
          email: p.email || userEmail,
          phone: p.phone || p.phoneNumber || "",
          address: p.address || "",
          nid: p.nid || p.nationalId || "",
          birthDate: p.birthDate || p.dateOfBirth || "",
        });
      } catch (e) {
        console.error("Profile load error:", e);
        // Set default profile data even if fetch fails
        setProfileData({
          name: user?.displayName || adminUser?.name || "",
          email: userEmail,
          phone: "",
          address: "",
          nid: "",
          birthDate: "",
        });
      } finally {
        setLoadingProfile(false);
      }
    };

    const loadReports = async () => {
      setLoadingReports(true);
      try {
        // Fetch regular corruption reports
        const reportsRes = await fetch(`${API_BASE}/reports`);
        let regularReports = [];
        if (reportsRes.ok) {
          const reportsData = await reportsRes.json();
          console.log("Regular reports loaded:", reportsData);
          regularReports = Array.isArray(reportsData?.data)
            ? reportsData.data
            : Array.isArray(reportsData)
              ? reportsData
              : [];
        }

        // Fetch ACC form reports
        const accRes = await fetch(`${API_BASE}/acc-form-reports`);
        let accFormReports = [];
        if (accRes.ok) {
          const accData = await accRes.json();
          console.log("ACC reports loaded:", accData);
          accFormReports = Array.isArray(accData?.data)
            ? accData.data
            : Array.isArray(accData)
              ? accData
              : [];
        }

        // Filter reports by user email (for non-anonymous regular reports)
        const userRegularReports = regularReports.filter(
          (r) =>
            !r.isAnonymous &&
            (r.userId === user?.uid || r.phone === profile?.phone),
        );

        // Filter ACC reports by complainant email
        const userAccReports = accFormReports.filter(
          (r) =>
            r.complainant?.email === userEmail ||
            r.complainant?.mobile === profile?.phone,
        );

        setReports(userRegularReports);
        setAccReports(userAccReports);

        // Combine all user reports for stats
        const allUserReports = [...userRegularReports, ...userAccReports];

        const totalReports = allUserReports.length;
        const pendingReports = allUserReports.filter(
          (r) => r.status === "pending",
        ).length;
        const resolvedReports = allUserReports.filter(
          (r) => r.status === "resolved",
        ).length;
        const underReviewReports = allUserReports.filter(
          (r) =>
            r.status === "under-review" || r.status === "under-investigation",
        ).length;

        setStats({
          totalReports,
          pendingReports,
          resolvedReports,
          underReviewReports,
        });

        console.log("Stats calculated:", {
          totalReports,
          pendingReports,
          resolvedReports,
          underReviewReports,
        });
      } catch (e) {
        console.error("Reports load error:", e);
        setReports([]);
        setAccReports([]);
        setStats({
          totalReports: 0,
          pendingReports: 0,
          resolvedReports: 0,
          underReviewReports: 0,
        });
      } finally {
        setLoadingReports(false);
      }
    };

    loadProfile();
    loadReports();
  }, [authReady, userEmail, user, adminUser, profile?.phone]);

  const getStatusClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "pending") return "bg-yellow-100 text-yellow-800";
    if (s === "under-review" || s === "under-investigation")
      return "bg-blue-100 text-blue-800";
    if (s === "resolved") return "bg-green-100 text-green-800";
    if (s === "rejected") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  const handleProfileEdit = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(
        `${API_BASE}/api/registration/by-email/${encodeURIComponent(
          profileData.email,
        )}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profileData),
        },
      );

      if (!res.ok) throw new Error("Failed to save profile");

      const updated = await res.json();
      console.log("Profile updated:", updated);

      setProfile(updated);
      setIsEditModalOpen(false);
      setError("");
    } catch (e) {
      console.error("Profile save error:", e);
      setError("Failed to save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  // Combine all reports for display
  const allReports = useMemo(() => {
    const combined = [
      ...reports.map((r) => ({
        id: r._id,
        type: "Regular Report",
        status: r.status,
        description: r.description?.substring(0, 50) + "...",
        location: r.incidentAddress || r.incidentDivision,
        date: r.submittedAt || r.createdAt,
        updatedAt: r.updatedAt,
        problemType: r.problemType,
      })),
      ...accReports.map((r) => ({
        id: r._id,
        type: "ACC Form",
        referenceNumber: r.referenceNumber,
        status: r.status,
        description: r.incident?.description?.substring(0, 50) + "...",
        location: r.incident?.location || r.incident?.division,
        date: r.submittedAt || r.createdAt,
        updatedAt: r.updatedAt,
        corruptionType: r.incident?.corruptionType,
        accused: r.accused?.name,
      })),
    ];

    // Sort by date (newest first)
    return combined.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [reports, accReports]);

  // Proper gating
  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 rounded-full border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Please log in to view your dashboard.</p>
      </div>
    );
  }

  // If authenticated but email still missing (rare), show loading
  if (!userEmail && isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading account...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      {/* Profile Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Edit Profile
                </h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleProfileSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      National ID (NID)
                    </label>
                    <div className="bg-gray-100 px-3 py-2 rounded-md text-gray-600">
                      {profileData.nid || "Not provided"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <div className="bg-gray-100 px-3 py-2 rounded-md text-gray-600">
                      {profileData.birthDate
                        ? new Date(profileData.birthDate).toLocaleDateString()
                        : "Not provided"}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={profileData.name || ""}
                      onChange={handleProfileEdit}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={profileData.email || ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      readOnly
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={profileData.phone || ""}
                      onChange={handleProfileEdit}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="+880 1xxx-xxxxxx"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Address
                    </label>
                    <textarea
                      name="address"
                      id="address"
                      value={profileData.address || ""}
                      onChange={handleProfileEdit}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter your full address"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-60"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>

                {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          User Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Reports</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.totalReports}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.pendingReports}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Under Review</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.underReviewReports}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Resolved</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.resolvedReports}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold mb-2">
                {loadingProfile
                  ? "Loading..."
                  : `Welcome, ${profile?.name || user?.displayName || "User"}!`}
              </h2>
              <p className="text-gray-600">
                This is your dashboard where you can track your activities,
                reports, and case updates.
              </p>
              {profile?.email && (
                <p className="text-sm text-gray-500 mt-1">
                  <span className="font-medium">Email:</span> {profile.email}
                </p>
              )}
              {profile?.phone && (
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Phone:</span> {profile.phone}
                </p>
              )}
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="text-indigo-600 hover:text-indigo-800 flex items-center"
              disabled={loadingProfile}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Profile
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>

              <div className="grid grid-cols-1 gap-4">
                <div
                  onClick={() => navigate("/reporting")}
                  className="bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition cursor-pointer"
                >
                  <h3 className="font-medium text-lg text-blue-800">
                    Submit Report
                  </h3>
                  <p className="mt-2 text-blue-600">
                    File a new incident report
                  </p>
                </div>

                <div
                  onClick={() => navigate("/form")}
                  className="bg-purple-50 p-4 rounded-lg hover:bg-purple-100 transition cursor-pointer"
                >
                  <h3 className="font-medium text-lg text-purple-800">
                    ACC Form
                  </h3>
                  <p className="mt-2 text-purple-600">
                    Submit ACC formal complaint
                  </p>
                </div>

                <div
                  onClick={() => navigate("/case")}
                  className="bg-green-50 p-4 rounded-lg hover:bg-green-100 transition cursor-pointer"
                >
                  <h3 className="font-medium text-lg text-green-800">
                    Case Tracking
                  </h3>
                  <p className="mt-2 text-green-600">
                    Track your reported cases
                  </p>
                </div>

                <div
                  onClick={() => setIsEditModalOpen(true)}
                  className="bg-orange-50 p-4 rounded-lg hover:bg-orange-100 transition cursor-pointer"
                >
                  <h3 className="font-medium text-lg text-orange-800">
                    Edit Profile
                  </h3>
                  <p className="mt-2 text-orange-600">
                    Update your personal information
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Reports Table */}}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Your Reports</h3>
                <button
                  onClick={() => navigate("/case")}
                  className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
                >
                  View All
                </button>
              </div>

              {loadingReports ? (
                <div className="py-12 text-center text-gray-500">
                  <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  Loading reports...
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Description
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Location
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {allReports.slice(0, 5).map((report) => (
                          <tr key={report.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {report.type}
                              {report.referenceNumber && (
                                <div className="text-xs text-gray-500">
                                  {report.referenceNumber}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              <div className="max-w-xs truncate">
                                {report.description}
                              </div>
                              {report.problemType && (
                                <span className="text-xs text-gray-400">
                                  {report.problemType}
                                </span>
                              )}
                              {report.corruptionType && (
                                <span className="text-xs text-gray-400">
                                  {report.corruptionType}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                                  report.status,
                                )}`}
                              >
                                {report.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(report.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="max-w-xs truncate">
                                {report.location}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {allReports.length === 0 && (
                    <div className="text-center py-8">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
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
                      <p className="text-gray-500 mt-2">
                        You haven't submitted any reports yet.
                      </p>
                      <button
                        onClick={() => navigate("/reporting")}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        Submit your first report
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
