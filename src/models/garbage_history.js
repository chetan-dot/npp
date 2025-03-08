import mongoose from "mongoose";

const garbageHistorySchema = new mongoose.Schema(
  {
    historyData: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.garbageHistory ||
  mongoose.model("garbageHistory", garbageHistorySchema);
