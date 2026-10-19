import Appointment from "../models/Appointment.js";
import Vehicle from "../models/Vehicle.js";

export const getAppointments = async (req, res) => {
  try {
    const filter = {};
    if (req.query.vehicleId) filter.vehicleId = req.query.vehicleId;
    if (req.query.status) filter.status = req.query.status;

    const appointments = await Appointment.find(filter)
      .populate("vehicleId", "registrationNumber make model currentOdometer")
      .sort({ scheduledDate: 1 });

    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.body.vehicleId);
    if (!vehicle) {
      return res
        .status(404)
        .json({ success: false, message: "Vehicle does not exist" });
    }

    const appointment = new Appointment(req.body);
    await appointment.save();
    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, actualCost, completionDate, serviceOdometer } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    if (appointment.status === "Cancelled" && status === "Completed") {
      return res.status(400).json({
        success: false,
        message: "Cancelled appointments cannot be completed.",
      });
    }

    if (status === "Completed") {
      if (!actualCost || Number(actualCost) <= 0) {
        return res.status(400).json({
          success: false,
          message: "Actual cost must be greater than zero.",
        });
      }

      const vehicle = await Vehicle.findById(appointment.vehicleId);
      if (!vehicle) {
        return res
          .status(404)
          .json({ success: false, message: "Associated vehicle not found." });
      }

      if (
        serviceOdometer === undefined ||
        Number(serviceOdometer) < vehicle.currentOdometer
      ) {
        return res.status(400).json({
          success: false,
          message: `Service odometer reading (${serviceOdometer}) cannot be lower than the vehicle's recorded odometer (${vehicle.currentOdometer}).`,
        });
      }

      appointment.actualCost = Number(actualCost);
      appointment.completionDate = completionDate
        ? new Date(completionDate)
        : new Date();
      appointment.serviceOdometer = Number(serviceOdometer);
      appointment.status = "Completed";

      vehicle.currentOdometer = Number(serviceOdometer);
      await vehicle.save();
    } else if (status === "Cancelled") {
      appointment.status = "Cancelled";
    }

    await appointment.save();
    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
