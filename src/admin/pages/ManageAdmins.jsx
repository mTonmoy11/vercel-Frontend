import { useState, useEffect } from "react";
import {
  FiSearch,
  FiEdit,
  FiTrash2,
  FiUserPlus,
  FiShield,
} from "react-icons/fi";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  // State for modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adminToEdit, setAdminToEdit] = useState(null);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [saving, setSaving] = useState(false);

  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "admin",
  });

  const [promoteData, setPromoteData] = useState({
    password: "",
    confirmPassword: "",
    role: "admin",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchAdmins();
    fetchUsers();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/admins`);
      if (!response.ok) throw new Error("Failed to fetch admins");

      const data = await response.json();
      console.log("Admins loaded:", data);

      setAdmins(data.data || []);
    } catch (err) {
      console.error("Error fetching admins:", err);
      setError("Failed to load admins. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE}/registers`);
      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      console.log("Users loaded:", data);

      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const validateAddForm = () => {
    const newErrors = {};

    if (!newAdmin.name.trim()) newErrors.name = "Name is required";
    if (!newAdmin.email.trim()) newErrors.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(newAdmin.email))
      newErrors.email = "Email is invalid";
    if (!newAdmin.password) newErrors.password = "Password is required";
    if (newAdmin.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (newAdmin.password !== newAdmin.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePromoteForm = () => {
    const newErrors = {};

    if (!promoteData.password) newErrors.password = "Password is required";
    if (promoteData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (promoteData.password !== promoteData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (!validateAddForm()) return;

    setSaving(true);
    try {
      const response = await fetch(`${API_BASE}/api/admins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newAdmin.email,
          password: newAdmin.password,
          name: newAdmin.name,
          role: newAdmin.role,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add admin");
      }

      console.log("Admin added:", result);

      // Reset form and close modal
      setNewAdmin({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "admin",
      });
      setShowAddModal(false);
      setErrors({});

      // Refresh admins list
      fetchAdmins();
    } catch (err) {
      console.error("Error adding admin:", err);
      alert(err.message || "Failed to add admin. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePromoteUser = async (e) => {
    e.preventDefault();
    if (!validatePromoteForm()) return;

    setSaving(true);
    try {
      const response = await fetch(`${API_BASE}/api/admins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: selectedUser.email,
          password: promoteData.password,
          name: selectedUser.name,
          role: promoteData.role,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to promote user");
      }

      console.log("User promoted to admin:", result);

      // Reset form and close modal
      setPromoteData({
        password: "",
        confirmPassword: "",
        role: "admin",
      });
      setShowPromoteModal(false);
      setSelectedUser(null);
      setErrors({});

      // Refresh admins list
      fetchAdmins();
    } catch (err) {
      console.error("Error promoting user:", err);
      alert(err.message || "Failed to promote user. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleEditAdmin = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updateData = {
        name: adminToEdit.name,
        role: adminToEdit.role,
        isActive: adminToEdit.isActive,
      };

      // Only include password if changed
      if (adminToEdit.newPassword) {
        if (adminToEdit.newPassword.length < 6) {
          alert("Password must be at least 6 characters");
          setSaving(false);
          return;
        }
        if (adminToEdit.newPassword !== adminToEdit.confirmPassword) {
          alert("Passwords do not match");
          setSaving(false);
          return;
        }
        updateData.password = adminToEdit.newPassword;
      }

      const response = await fetch(
        `${API_BASE}/api/admins/${adminToEdit._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) throw new Error("Failed to update admin");

      console.log("Admin updated");

      setShowEditModal(false);
      setAdminToEdit(null);
      fetchAdmins();
    } catch (err) {
      console.error("Error updating admin:", err);
      alert("Failed to update admin. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAdmin = async () => {
    try {
      const response = await fetch(
        `${API_BASE}/api/admins/${adminToDelete._id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete admin");
      }

      console.log("Admin deleted");
      setShowDeleteModal(false);
      setAdminToDelete(null);
      fetchAdmins();
    } catch (err) {
      console.error("Error deleting admin:", err);
      alert(err.message || "Failed to delete admin. Please try again.");
    }
  };

  const filteredAdmins = admins.filter((admin) => {
    const term = searchTerm.toLowerCase();
    return (
      (admin.name || "").toLowerCase().includes(term) ||
      (admin.email || "").toLowerCase().includes(term) ||
      (admin.role || "").toLowerCase().includes(term)
    );
  });

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      (user.name || "").toLowerCase().includes(term) ||
      (user.email || "").toLowerCase().includes(term) ||
      (user.phone || "").includes(term)
    );
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="pt-16 p-4 md:p-6 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admins...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 p-4 md:p-6 min-h-screen bg-gray-50">
      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="border-b p-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">
                Add New Administrator
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAdmin} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={newAdmin.name}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, name: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={newAdmin.email}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, email: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="admin@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <select
                    value={newAdmin.role}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, role: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="admin">Admin</option>
                    <option value="super-admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={newAdmin.password}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, password: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Create password"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    value={newAdmin.confirmPassword}
                    onChange={(e) =>
                      setNewAdmin({
                        ...newAdmin,
                        confirmPassword: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Confirm password"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-60"
                  disabled={saving}
                >
                  {saving ? "Adding..." : "Add Administrator"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Promote User Modal */}
      {showPromoteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="border-b p-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">
                Promote User to Admin
              </h3>
              <button
                onClick={() => setShowPromoteModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePromoteUser} className="p-6">
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-700">
                  <strong>Name:</strong> {selectedUser.name}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Phone:</strong> {selectedUser.phone || "N/A"}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Role *
                  </label>
                  <select
                    value={promoteData.role}
                    onChange={(e) =>
                      setPromoteData({ ...promoteData, role: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="admin">Admin</option>
                    <option value="super-admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Set Admin Password *
                  </label>
                  <input
                    type="password"
                    value={promoteData.password}
                    onChange={(e) =>
                      setPromoteData({
                        ...promoteData,
                        password: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Create admin password"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    value={promoteData.confirmPassword}
                    onChange={(e) =>
                      setPromoteData({
                        ...promoteData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Confirm password"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowPromoteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-60"
                  disabled={saving}
                >
                  {saving ? "Promoting..." : "Promote to Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {showEditModal && adminToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="border-b p-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">
                Edit Administrator
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditAdmin} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={adminToEdit.name}
                    onChange={(e) =>
                      setAdminToEdit({ ...adminToEdit, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={adminToEdit.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={adminToEdit.role}
                    onChange={(e) =>
                      setAdminToEdit({ ...adminToEdit, role: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    disabled={adminToEdit.email === "tonmoy.sufian01@gmail.com"}
                  >
                    <option value="admin">Admin</option>
                    <option value="super-admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={adminToEdit.isActive}
                    onChange={(e) =>
                      setAdminToEdit({
                        ...adminToEdit,
                        isActive: e.target.value === "true",
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    disabled={adminToEdit.email === "tonmoy.sufian01@gmail.com"}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password (leave blank to keep current)
                  </label>
                  <input
                    type="password"
                    value={adminToEdit.newPassword || ""}
                    onChange={(e) =>
                      setAdminToEdit({
                        ...adminToEdit,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter new password"
                  />
                </div>

                {adminToEdit.newPassword && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={adminToEdit.confirmPassword || ""}
                      onChange={(e) =>
                        setAdminToEdit({
                          ...adminToEdit,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Confirm new password"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
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
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && adminToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-900">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete admin{" "}
              <strong>{adminToDelete.name}</strong>? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAdmin}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete Admin
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Manage Admins
          </h1>
          <p className="text-gray-500 mt-1">
            View and manage all administrators ({admins.length} total)
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search admins..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
              >
                <FiUserPlus className="mr-2" />
                Add New Admin
              </button>
              <button
                onClick={fetchAdmins}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Admins Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h3 className="text-lg font-semibold text-gray-800">
              Current Administrators
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Admin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAdmins.map((admin) => (
                  <tr
                    key={admin._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <FiShield className="text-purple-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {admin.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {admin.email}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${
                          admin.role === "super-admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {admin.role === "super-admin" ? "Super Admin" : "Admin"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${
                          admin.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {admin.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(admin.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(admin.lastLogin)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => {
                            setAdminToEdit(admin);
                            setShowEditModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors p-1.5 rounded-md hover:bg-indigo-50"
                        >
                          <FiEdit className="w-5 h-5" />
                        </button>
                        {admin.email !== "tonmoy.sufian01@gmail.com" && (
                          <button
                            onClick={() => {
                              setAdminToDelete(admin);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 hover:text-red-900 transition-colors p-1.5 rounded-md hover:bg-red-50"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAdmins.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No administrators found</p>
            </div>
          )}
        </div>

        {/* Promote Users Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h3 className="text-lg font-semibold text-gray-800">
              Promote Users to Admin
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Select a user to promote them to administrator
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Division
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.slice(0, 10).map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-800 font-medium">
                            {(user.name || "U").charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {user.phone || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {user.division || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowPromoteModal(true);
                        }}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                      >
                        Promote
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No users found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageAdmins;
