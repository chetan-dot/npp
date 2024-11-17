import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
  },
  password: {
    type: String,
    required: true,
    maxlength: 255,
  },
  role: {
    type: String,
    required: true,
    maxlength: 100,
  },
  ward_assigned:{
    type:[String],
    required:true,
  },
  isActive: {
    type: Boolean,
    default: false,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  mobile_number:{
    type: String,
    required: true,

  }
});

// Middleware to update the `updated_at` field
userSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

export default mongoose.models.User || mongoose.model("User", userSchema);
