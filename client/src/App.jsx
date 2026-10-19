import React, { useState } from "react";
import Navbar from "./Components/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Vehicles from "./pages/Vehicles.jsx";
import Appointments from "./pages/Appointements.jsx";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "vehicles" && <Vehicles />}
        {activeTab === "appointments" && <Appointments />}
      </main>
    </div>
  );
}
