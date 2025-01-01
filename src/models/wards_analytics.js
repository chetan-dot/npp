import mongoose from "mongoose";

const wardsDataSchema = new mongoose.Schema(
  {
    data: {
      type: [Object],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Check if the model already exists before defining it
const WardsAnalytics =
  mongoose.models.wards_analytic || mongoose.model("wards_analytic", wardsDataSchema);

export default WardsAnalytics;
