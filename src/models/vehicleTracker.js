import mongoose from "mongoose";

const vehcileSchema = new mongoose.Schema(
  {
    vehicleNo: {
      type: String,
    },
    ownerName: {
      type: String,
    },
    deviceId: {
      type: String,
    },
    garbageCollectorId: {
      type: String,
    },
    vehicleType: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.vehicle ||
  mongoose.model("vehicle", vehcileSchema);
