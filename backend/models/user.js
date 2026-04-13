const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true,trim: true },
  email: { type: String, required: true, unique: true ,match: [/^\S+@\S+\.\S+$/, "Please use valid email"]},
  password: { type: String, required: true,
    minlength: 6 },
  role: { type: String, enum: ["student", "company", "admin"], default: "student" },
  profileCompleted: { type: Boolean, default: false },
  
  // Student Specific Fields
 phone: {
    type: Number
  },

  university: String,
  collegeId: String,
  course: String,
  specialization: String,
  skills: [String],
  projectDescription: {
    type: String,
    maxlength: 500
  },

  githubLink: {
    type: String,
    match: [/^https?:\/\/.+/, "Enter valid URL"]
  },

  linkedinLink: {
    type: String,
    match: [/^https?:\/\/.+/, "Enter valid URL"]
  },
  xthBoard: String,
  xthMarks: {
    type: Number
  },
  xiithBoard: String,
  xiithMarks: {
    type: Number
  },

 gradMarks: {
    type: Number
  },
  
  isVerified: {
  type: Boolean,
  default:false
},

  resume: String,
 otp: {
  type: Number
},
otpExpiry: {
  type: Date
},
}, { timestamps: true });


const User = mongoose.model("User", userSchema);
module.exports = User;