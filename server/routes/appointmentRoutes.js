import express from "express";
import {
  getAppointments,
  createAppointment,
  updateAppointmentStatus,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.route("/").get(getAppointments).post(createAppointment);
router.route("/:id/status").patch(updateAppointmentStatus);

export default router;
