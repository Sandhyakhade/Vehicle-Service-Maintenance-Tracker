import React, { useEffect, useState } from "react";
import API from "../api";
import { Car, Clock, AlertTriangle, IndianRupee } from "lucide-react";

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalVehicles: 0,
    upcomingAppointments: 0,
    overdueAppointments: 0,
    totalExpenditure: 0,
    upcomingList: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/dashboard")
      .then((res) => {
        if (res.data.success) setMetrics(res.data.data);
      })
      .catch((err) => console.error("Error loading dashboard metrics:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500">Loading dashboard...</div>
    );
  }

  const statCards = [
    {
      title: "Total Vehicles",
      value: metrics.totalVehicles,
      icon: Car,
      bg: "bg-blue-500",
    },
    {
      title: "Upcoming Appointments",
      value: metrics.upcomingAppointments,
      icon: Clock,
      bg: "bg-indigo-500",
    },
    {
      title: "Overdue Appointments",
      value: metrics.overdueAppointments,
      icon: AlertTriangle,
      bg: "bg-amber-500",
    },
    {
      title: "Total Expenditure",
      value: `₹${metrics.totalExpenditure.toLocaleString()}`,
      icon: IndianRupee,
      bg: "bg-emerald-500",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">
        Operational Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-lg p-5 shadow-sm border border-slate-200 flex items-center justify-between"
            >
              <div>
                <p className="text-xs uppercase font-medium text-slate-500">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-slate-800 mt-1">
                  {card.value}
                </p>
              </div>
              <div className={`${card.bg} text-white p-3 rounded-lg shadow-sm`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-800">
            Upcoming Scheduled Appointments
          </h2>
        </div>
        <div className="divide-y divide-slate-100">
          {metrics.upcomingList.length === 0 ? (
            <p className="p-6 text-sm text-slate-500 text-center">
              No upcoming appointments scheduled.
            </p>
          ) : (
            metrics.upcomingList.map((app) => (
              <div
                key={app._id}
                className="p-4 flex items-center justify-between hover:bg-slate-50"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {app.serviceType} — {app.vehicleId?.make}{" "}
                    {app.vehicleId?.model} ({app.vehicleId?.registrationNumber})
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Center: {app.serviceCentre}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-medium">
                    {new Date(app.scheduledDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
