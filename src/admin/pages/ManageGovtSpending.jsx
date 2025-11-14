import React, { useState, useEffect } from "react";
import { FiSave, FiEdit, FiTrash2, FiX } from "react-icons/fi";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ManageGovtSpending = () => {
  const [budgetItems, setBudgetItems] = useState([]);
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    budget: "",
    actual: "",
    color: "#003f5c",
    year: new Date().getFullYear().toString(),
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load from API
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/govt-spending`);
      const json = await res.json();
      if (json.success) setBudgetItems(json.data);
    } catch (e) {
      console.error("Failed to load items", e);
      alert("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const val = name === "budget" || name === "actual" ? Number(value) : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      formData.budget === "" ||
      formData.actual === "" ||
      !formData.year
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      if (isEditing && formData._id) {
        const res = await fetch(
          `${API_BASE}/api/govt-spending/${formData._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: formData.name,
              budget: Number(formData.budget),
              actual: Number(formData.actual),
              color: formData.color,
              year: formData.year,
            }),
          }
        );
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Update failed");
        await fetchItems();
      } else {
        const res = await fetch(`${API_BASE}/api/govt-spending`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            budget: Number(formData.budget),
            actual: Number(formData.actual),
            color: formData.color,
            year: formData.year,
          }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Create failed");
        setBudgetItems((prev) => [json.data, ...prev]);
      }
      resetForm();
    } catch (e) {
      console.error(e);
      alert(e.message || "Operation failed");
    }
  };

  const handleEdit = (item) => {
    setFormData({
      _id: item._id,
      name: item.name,
      budget: item.budget,
      actual: item.actual,
      color: item.color,
      year: item.year || new Date().getFullYear().toString(),
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this item?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/govt-spending/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Delete failed");
      setBudgetItems((prev) => prev.filter((i) => i._id !== id));
    } catch (e) {
      console.error(e);
      alert(e.message || "Delete failed");
    }
  };

  const resetForm = () => {
    setFormData({
      _id: "",
      name: "",
      budget: "",
      actual: "",
      color: "#003f5c",
      year: new Date().getFullYear().toString(),
    });
    setIsEditing(false);
  };

  // Generate year options (last 5 years and next 2 years)
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 2; i++) {
      years.push(i.toString());
    }
    return years;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">
              Government Spending Management
            </h1>
            <p className="text-blue-100">
              {isEditing ? "Edit Budget Item" : "Add New Budget Item"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sector Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Healthcare"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fiscal Year *
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {generateYearOptions().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget Allocation ($) *
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 5000000"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Actual Spending ($) *
                </label>
                <input
                  type="number"
                  name="actual"
                  value={formData.actual}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 4800000"
                  min="0"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color Code
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="w-10 h-10 border-0 rounded cursor-pointer"
                  />
                  <span className="ml-3 text-sm text-gray-500">
                    {formData.color}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <FiX className="mr-2" />
                  Cancel Edit
                </button>
              )}
              <button
                type="submit"
                className="flex items-center px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
              >
                <FiSave className="mr-2" />
                {isEditing ? "Update Item" : "Add New Item"}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Budget Items</h2>
              <p className="text-gray-600">
                {budgetItems.length} sector{budgetItems.length !== 1 ? "s" : ""}{" "}
                saved in database
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Total Budget: $
              {budgetItems
                .reduce((sum, item) => sum + (Number(item.budget) || 0), 0)
                .toLocaleString()}
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sector
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Color
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Budget
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actual
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Variance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {budgetItems.map((item) => {
                    const variance = Number(item.actual) - Number(item.budget);
                    const variancePercent =
                      Number(item.budget) > 0
                        ? ((variance / Number(item.budget)) * 100).toFixed(1)
                        : "0.0";

                    return (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-3"
                              style={{ backgroundColor: item.color }}
                            ></div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.year || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.color}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${Number(item.budget).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${Number(item.actual).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className={`text-sm font-medium ${
                              variance >= 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {variance >= 0 ? "+" : ""}
                            {variance.toLocaleString()} ({variancePercent}%)
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            <FiEdit className="inline mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FiTrash2 className="inline mr-1" /> Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {budgetItems.length === 0 && !loading && (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No budget items found. Add your first item using the
                        form above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Data is stored securely in the database
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageGovtSpending;
