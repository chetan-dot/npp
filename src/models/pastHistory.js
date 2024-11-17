import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    house_id: {
      type: String,
      required: true,
      maxlength: 100,
    },
    employee_id: {
      type: String,
      required: true,
      maxlength: 100,
    },
    employee_name: {
      type: String,
      required: true,
    },
    user_ward: {
      type: Number,
      required: true,
    },
    is_garabge_collected: {
      type: Boolean,
      required: true,
    },
    message: {
      type: String,
      required: function () {
        return !this.is_garabge_collected;
      },
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.past_history ||
  mongoose.model("past_history", historySchema);
