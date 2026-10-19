import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: [true, "Registration number is required"],
      unique: true,
      trim: true,
      uppercase: true,
      set: (val) =>
        val ? val.replace(/[^a-zA-Z0-9]/g, "").toUpperCase() : val, 
    },
    make: { type: String, required: [true, "Make is required"], trim: true },
    model: { type: String, required: [true, "Model is required"], trim: true },
    manufacturingYear: {
      type: Number,
      required: [true, "Manufacturing year is required"],
      min: [1900, "Year must be 1900 or later"],
      max: [new Date().getFullYear() + 1, "Year cannot be in the far future"],
    },
    fuelType: {
      type: String,
      required: [true, "Fuel type is required"],
      enum: ["Petrol", "Diesel", "Electric", "Hybrid", "CNG"],
    },
    currentOdometer: {
      type: Number,
      required: [true, "Current odometer is required"],
      min: [0, "Odometer reading cannot be negative"],
    },
    nickname: { type: String, trim: true, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("Vehicle", vehicleSchema);
