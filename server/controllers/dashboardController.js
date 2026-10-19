import Vehicle from "../models/Vehicle.js";
import Appointment from "../models/Appointment.js";

export const getDashboardMetrics = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      totalVehicles,
      upcomingAppointments,
      overdueAppointments,
      expenditureResult,
      upcomingList,
    ] = await Promise.all([
      Vehicle.countDocuments(),
      Appointment.countDocuments({
        status: "Scheduled",
        scheduledDate: { $gte: startOfToday },
      }),
      Appointment.countDocuments({
        status: "Scheduled",
        scheduledDate: { $lt: startOfToday },
      }),
      Appointment.aggregate([
        { $match: { status: "Completed" } },
        { $group: { _id: null, total: { $sum: "$actualCost" } } },
      ]),
      Appointment.find({
        status: "Scheduled",
        scheduledDate: { $gte: startOfToday },
      })
        .populate("vehicleId", "registrationNumber make model")
        .sort({ scheduledDate: 1 })
        .limit(5),
    ]);

    const totalExpenditure =
      expenditureResult.length > 0 ? expenditureResult[0].total : 0;

    res.status(200).json({
      success: true,
      data: {
        totalVehicles,
        upcomingAppointments,
        overdueAppointments,
        totalExpenditure,
        upcomingList,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
