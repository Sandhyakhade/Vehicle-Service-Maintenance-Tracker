import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: [true, "Associated vehicle is required"],
    },
    serviceType: {
      type: String,
      required: [true, "Service type is required"],
      trim: true,
    },
    scheduledDate: {
      type: Date,
      required: [true, "Scheduled date is required"],
    },
    estimatedCost: {
      type: Number,
      required: [true, "Estimated cost is required"],
      min: [0, "Estimated cost cannot be negative"],
    },
    serviceCentre: {
      type: String,
      required: [true, "Service centre name is required"],
      trim: true,
    },
    notes: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled"],
      default: "Scheduled",
    },
    actualCost: {
      type: Number,
      min: [0.01, "Actual cost must be greater than zero"],
      default: null,
    },
    completionDate: {
      type: Date,
      default: null,
    },
    serviceOdometer: {
      type: Number,
      min: [0, "Service odometer cannot be negative"],
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Appointment", appointmentSchema);
