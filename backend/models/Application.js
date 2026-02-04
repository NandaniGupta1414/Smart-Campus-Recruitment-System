const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    
    status: {
      type: String,
      enum: ["applied", "shortlisted", "rejected"],
      default: "applied",
    },
    interviewDate: { type: String }, // NEW
  interviewTime: { type: String }, // NEW
  interviewLink: { type: String }  // NEW (Zoom/Google Meet)
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
