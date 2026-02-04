const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "company", "admin"], default: "student" },
  profileCompleted: { type: Boolean, default: false },
  
  // Student Specific Fields
  phone: String,
  university: String,
  collegeId: String,
  course: String,
  specialization: String,
  skills: [String],
  projectDescription: String,
  githubLink: String,
  linkedinLink: String,
  xthBoard: String,
  xthMarks: String,
  xiithBoard: String,
  xiithMarks: String,
  gradMarks: String,
  resume: String,
}, { timestamps: true });

// Note: Humne yahan se pre-save hashing hata di hai kyunki hum Controller mein hash kar rahe hain.

const User = mongoose.model("User", userSchema);
module.exports = User;