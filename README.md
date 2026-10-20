# Vehicle Service & Maintenance Tracker

A full-stack vehicle fleet maintenance management platform built to track vehicle registrations, manage service appointments, enforce strict data integrity rules, and compute real-time operational metrics.

---

## Features

### 1. Vehicle Management
- **CRUD Operations**: Register, view, update, and remove vehicle records.
- **Normalization**: Registration numbers are automatically stripped of whitespace and non-alphanumeric characters, and stored in uppercase (e.g., `mh12 ab 1234` → `MH12AB1234`).
- **Data Validation**: Strict checks for non-negative odometer readings, sensible manufacturing years (1900 to current year + 1), and unique registration indexing.
- **Cascade Cleanup**: Deleting a vehicle automatically removes all dependent service appointments.

### 2. Service Appointments & Business Invariants
- **Appointment Lifecycle**: Track statuses across `Scheduled`, `Completed`, and `Cancelled`.
- **Domain Rules**:
  - Cancelled appointments cannot transition to `Completed`.
  - Service completion requires an `actualCost > 0`.
  - Service odometer on completion must be greater than or equal to the vehicle's current recorded odometer reading.
  - Completing an appointment automatically syncs and updates the parent vehicle's odometer to the new reading.

### 3. Operational Dashboard
- Dynamic real-time calculations directly aggregated from the MongoDB database (no hardcoded metrics).
- Metric breakdown:
  - **Total Vehicles**: Total count of registered assets.
  - **Upcoming Appointments**: Services scheduled on or after midnight today (`>= startOfDay`).
  - **Overdue Appointments**: Incomplete services with scheduled dates strictly before midnight today (`< startOfDay`).
  - **Total Expenditure**: Sum of `actualCost` across all completed maintenance records.
- Live upcoming service queue.

---

## Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS, Lucide React, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Schema-level Mongoose validators and regex normalization

---

## Project Structure

```text
Vehicle-Service-Maintenance-Tracker/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Navbar, CompleteModal
│   │   ├── pages/          # Dashboard, Vehicles, Appointments
│   │   ├── api.js          # Axios configuration
│   │   ├── App.jsx
│   │   └── index.css       # Tailwind directives
│   └── package.json
├── server/                 # Express REST API backend
│   ├── config/             # Database connection singleton
│   ├── controllers/        # Route logic & aggregations
│   ├── models/             # Vehicle & Appointment Mongoose schemas
│   ├── routes/             # REST API endpoints
│   ├── .env.example        # Environment template
│   ├── server.js           # Server entry point
│   └── package.json
└── README.md