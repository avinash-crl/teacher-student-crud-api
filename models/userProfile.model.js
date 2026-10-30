const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    age: { type: Number, min: 1, max: 120 },
    dob: { type: Date },
    bio: { type: String, trim: true, maxlength: 1000 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserProfile", userProfileSchema);
