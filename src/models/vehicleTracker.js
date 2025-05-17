import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    vehicleNo: {
      type: String,
    },
    vehicleName: {
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
    ward: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.vehicle ||
  mongoose.model("vehicle", vehicleSchema);
