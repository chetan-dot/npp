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
<<<<<<< HEAD

=======
>>>>>>> b2ec17aed3cf6d26b51ff441ce74b8f88b6773a2
