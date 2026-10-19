import React, { useState, useEffect } from "react";
import API from "../api";
import { Plus, CheckCircle, XCircle, X } from "lucide-react";
import CompleteModal from "../Components/completeModel.jsx";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [completingApp, setCompletingApp] = useState(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    vehicleId: "",
    serviceType: "Regular Maintenance",
    scheduledDate: "",
    estimatedCost: "",
    serviceCentre: "",
    notes: "",
  });

  const fetchData = async () => {
    try {
      const [appRes, vehRes] = await Promise.all([
        API.get("/appointments"),
        API.get("/vehicles"),
      ]);
      if (appRes.data.success) setAppointments(appRes.data.data);
      if (vehRes.data.success) {
        setVehicles(vehRes.data.data);
        if (vehRes.data.data.length > 0 && !formData.vehicleId) {
          setFormData((prev) => ({
            ...prev,
            vehicleId: vehRes.data.data[0]._id,
          }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await API.post("/appointments", {
        ...formData,
        estimatedCost: parseFloat(formData.estimatedCost),
      });
      setShowModal(false);
      setFormData({
        vehicleId: vehicles[0]?._id || "",
        serviceType: "Regular Maintenance",
        scheduledDate: "",
        estimatedCost: "",
        serviceCentre: "",
        notes: "",
      });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm("Cancel this appointment?")) {
      try {
        await API.patch(`/appointments/${id}/status`, { status: "Cancelled" });
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || "Cancellation failed");
      }
    }
  };

  const handleCompleteSubmit = async (id, payload) => {
    try {
      await API.patch(`/appointments/${id}/status`, payload);
      setCompletingApp(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to complete appointment");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            Completed
          </span>
        );
      case "Cancelled":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            Scheduled
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          Service Appointments
        </h1>
        <button
          onClick={() => setShowModal(true)}
          disabled={vehicles.length === 0}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-md text-sm font-medium text-white shadow-sm ${
            vehicles.length === 0
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          <Plus className="h-4 w-4" />
          <span>Book Appointment</span>
        </button>
      </div>

      {vehicles.length === 0 && (
        <div className="p-3 bg-amber-50 text-amber-700 text-xs rounded border border-amber-200">
          Please add at least one vehicle before scheduling a service
          appointment.
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <th className="py-3 px-4">Vehicle</th>
              <th className="py-3 px-4">Service</th>
              <th className="py-3 px-4">Center</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Est. Cost</th>
              <th className="py-3 px-4">Actual Cost</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {appointments.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-slate-400">
                  No appointments registered.
                </td>
              </tr>
            ) : (
              appointments.map((app) => (
                <tr key={app._id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {app.vehicleId?.make} {app.vehicleId?.model}
                    <span className="block text-xs font-mono text-slate-400">
                      {app.vehicleId?.registrationNumber}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {app.serviceType}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {app.serviceCentre}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {new Date(app.scheduledDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    ₹{app.estimatedCost}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {app.actualCost ? `₹${app.actualCost}` : "—"}
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(app.status)}</td>
                  <td className="py-3 px-4 text-right space-x-2">
                    {app.status === "Scheduled" && (
                      <>
                        <button
                          onClick={() => setCompletingApp(app)}
                          title="Complete Service"
                          className="text-emerald-600 hover:text-emerald-700 p-1"
                        >
                          <CheckCircle className="h-4 w-4 inline" />
                        </button>
                        <button
                          onClick={() => handleCancel(app._id)}
                          title="Cancel Service"
                          className="text-red-500 hover:text-red-600 p-1"
                        >
                          <XCircle className="h-4 w-4 inline" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-slate-800 mb-4">
              Book Service
            </h2>

            {error && (
              <div className="mb-4 p-2 bg-red-50 text-red-700 text-xs rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Select Vehicle *
                </label>
                <select
                  value={formData.vehicleId}
                  onChange={(e) =>
                    setFormData({ ...formData, vehicleId: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-sm bg-white"
                >
                  {vehicles.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.make} {v.model} ({v.registrationNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Service Type *
                </label>
                <input
                  type="text"
                  required
                  value={formData.serviceType}
                  onChange={(e) =>
                    setFormData({ ...formData, serviceType: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-sm"
                  placeholder="Oil Change, Wheel Alignment..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Scheduled Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.scheduledDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        scheduledDate: e.target.value,
                      })
                    }
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Estimated Cost (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formData.estimatedCost}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        estimatedCost: e.target.value,
                      })
                    }
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Service Centre *
                </label>
                <input
                  type="text"
                  required
                  value={formData.serviceCentre}
                  onChange={(e) =>
                    setFormData({ ...formData, serviceCentre: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-sm"
                  placeholder="Official Service Hub"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Notes
                </label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-sm"
                  placeholder="Optional issues noted..."
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 border rounded text-xs text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 text-white rounded text-xs font-medium hover:bg-indigo-700"
                >
                  Book Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {completingApp && (
        <CompleteModal
          appointment={completingApp}
          onClose={() => setCompletingApp(null)}
          onComplete={handleCompleteSubmit}
        />
      )}
    </div>
  );
}
