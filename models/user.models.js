const mongoose = require("mongoose");

const ROLES = Object.freeze({
  STUDENT: "STUDENT",
  FACULTY: "FACULTY"
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254
    },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.STUDENT,
      required: true
    },
    isActive: { type: Boolean, default: true },
    profile: { type: mongoose.Schema.Types.ObjectId, ref: "UserProfile", default: null }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = { User, ROLES };
