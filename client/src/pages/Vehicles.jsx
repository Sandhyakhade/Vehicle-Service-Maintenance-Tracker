import React, { useState, useEffect } from "react";
import API from "../api";
import { Plus, Trash2, Edit3, X } from "lucide-react";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    registrationNumber: "",
    make: "",
    model: "",
    manufacturingYear: new Date().getFullYear(),
    fuelType: "Petrol",
    currentOdometer: 0,
    nickname: "",
  });

  const fetchVehicles = async () => {
    try {
      const res = await API.get("/vehicles");
      if (res.data.success) setVehicles(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const resetForm = () => {
    setFormData({
      registrationNumber: "",
      make: "",
      model: "",
      manufacturingYear: new Date().getFullYear(),
      fuelType: "Petrol",
      currentOdometer: 0,
      nickname: "",
    });
    setEditingId(null);
    setError("");
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await API.put(`/vehicles/${editingId}`, formData);
      } else {
        await API.post("/vehicles", formData);
      }
      resetForm();
      fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (vehicle) => {
    setEditingId(vehicle._id);
    setFormData({
      registrationNumber: vehicle.registrationNumber,
      make: vehicle.make,
      model: vehicle.model,
      manufacturingYear: vehicle.manufacturingYear,
      fuelType: vehicle.fuelType,
      currentOdometer: vehicle.currentOdometer,
      nickname: vehicle.nickname || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure? Deleting this vehicle will permanently remove all associated service records.",
      )
    ) {
      try {
        await API.delete(`/vehicles/${id}`);
        fetchVehicles();
      } catch (err) {
        alert("Failed to delete vehicle.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Vehicle Registry</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center space-x-1.5 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Add Vehicle</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <th className="py-3 px-4">Reg Number</th>
              <th className="py-3 px-4">Make & Model</th>
              <th className="py-3 px-4">Year</th>
              <th className="py-3 px-4">Fuel</th>
              <th className="py-3 px-4">Odometer</th>
              <th className="py-3 px-4">Nickname</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {vehicles.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-slate-400">
                  No vehicles registered. Click "Add Vehicle" to register one.
                </td>
              </tr>
            ) : (
              vehicles.map((v) => (
                <tr key={v._id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-medium text-indigo-700">
                    {v.registrationNumber}
                  </td>
                  <td className="py-3 px-4 text-slate-800">
                    {v.make} {v.model}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {v.manufacturingYear}
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs">
                      {v.fuelType}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {v.currentOdometer.toLocaleString()} km
                  </td>
                  <td className="py-3 px-4 text-slate-500 italic">
                    {v.nickname || "—"}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(v)}
                      className="text-slate-500 hover:text-indigo-600 p-1"
                    >
                      <Edit3 className="h-4 w-4 inline" />
                    </button>
                    <button
                      onClick={() => handleDelete(v._id)}
                      className="text-slate-500 hover:text-red-600 p-1"
                    >
                      <Trash2 className="h-4 w-4 inline" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
            <button
              onClick={resetForm}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-slate-800 mb-4">
              {editingId ? "Edit Vehicle" : "Register New Vehicle"}
            </h2>

            {error && (
              <div className="mb-4 p-2.5 bg-red-50 text-red-700 text-sm rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Registration No *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.registrationNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        registrationNumber: e.target.value,
                      })
                    }
                    placeholder="mh12 ab 1234"
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm uppercase outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <span className="text-[10px] text-slate-400">
                    Auto-normalized
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Nickname (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.nickname}
                    onChange={(e) =>
                      setFormData({ ...formData, nickname: e.target.value })
                    }
                    placeholder="e.g. Daily Ride"
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Make *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.make}
                    onChange={(e) =>
                      setFormData({ ...formData, make: e.target.value })
                    }
                    placeholder="Hyundai"
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Model *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.model}
                    onChange={(e) =>
                      setFormData({ ...formData, model: e.target.value })
                    }
                    placeholder="Creta"
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Mfg Year *
                  </label>
                  <input
                    type="number"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    required
                    value={formData.manufacturingYear}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        manufacturingYear: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Fuel Type *
                  </label>
                  <select
                    value={formData.fuelType}
                    onChange={(e) =>
                      setFormData({ ...formData, fuelType: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="CNG">CNG</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Odometer (km) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.currentOdometer}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currentOdometer: Math.max(
                          0,
                          parseInt(e.target.value, 10) || 0,
                        ),
                      })
                    }
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3 py-1.5 border rounded text-xs text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 text-white rounded text-xs font-medium hover:bg-indigo-700"
                >
                  {editingId ? "Update Vehicle" : "Save Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
