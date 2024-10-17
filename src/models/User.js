
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    city: String,
    country: String,
    gender: String,
    skills: String,
    specialty: String,
    CEOEmail: String,
    socialPlatform: String,
    location: String,
    companyName: String,
    organizer: Boolean,
    block: Boolean,
    followers: [{ type: String }],
    review: [
      {
        name: { type: String, required: true },
        email: { type: String, required: true },
        photo: { type: String }, // Optional if not required
        message: { type: String, required: true }
      }
    ],
    email: {
      type: String,
      unique: true
    },
    gender: {
      type: String,
      // enum: ['Male', 'Female'] // Restricting gender values to specific options
    },
    specialty: String,
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String, // Specify the type
      enum: ["user", "admin", "organizer"],
      default: "user",
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
