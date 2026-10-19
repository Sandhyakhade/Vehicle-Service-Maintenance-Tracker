import React, { useState } from "react";

export default function CompleteModal({ appointment, onClose, onComplete }) {
  const [actualCost, setActualCost] = useState("");
  const [serviceOdometer, setServiceOdometer] = useState(
    appointment.vehicleId?.currentOdometer || "",
  );
  const [completionDate, setCompletionDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const cost = parseFloat(actualCost);
    const odo = parseInt(serviceOdometer, 10);
    const currentOdo = appointment.vehicleId?.currentOdometer || 0;

    if (isNaN(cost) || cost <= 0) {
      setError("Actual cost must be greater than zero.");
      return;
    }
    if (isNaN(odo) || odo < currentOdo) {
      setError(`Odometer must be at least ${currentOdo} km.`);
      return;
    }

    onComplete(appointment._id, {
      status: "Completed",
      actualCost: cost,
      serviceOdometer: odo,
      completionDate,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          Complete Appointment
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Vehicle: {appointment.vehicleId?.make} {appointment.vehicleId?.model}{" "}
          ({appointment.vehicleId?.registrationNumber})
        </p>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Actual Cost (₹)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={actualCost}
              onChange={(e) => setActualCost(e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g. 4500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Service Odometer Reading (km)
            </label>
            <input
              type="number"
              required
              value={serviceOdometer}
              onChange={(e) => setServiceOdometer(e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <span className="text-xs text-slate-500">
              Must be ≥ {appointment.vehicleId?.currentOdometer || 0} km
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Completion Date
            </label>
            <input
              type="date"
              required
              value={completionDate}
              onChange={(e) => setCompletionDate(e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-sm text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700"
            >
              Mark Completed
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
