const fs = require("fs");
const path = require("path");
const User = require("../models/user");
const Job = require("../models/job");
const Application = require("../models/Application");

// 1. DASHBOARD STATS (Total counts for Admin Home)
exports.getStats = async (req, res) => {
  try {
    const studentCount = await User.countDocuments({ role: "student" });
    const companyCount = await User.countDocuments({ role: "company" });
    const jobCount = await Job.countDocuments();

    // 🔥 SMART COUNT LOGIC:
    // Hum sirf wahi applications count karenge jinka 'job' null nahi hai
    // Matlab jinki main Job delete nahi hui hai
    const allApps = await Application.find().populate("job");
    const validApps = allApps.filter(app => app.job !== null);
    const applicationCount = validApps.length;

    res.status(200).json({
      studentCount,
      companyCount,
      jobCount,
      applicationCount // Ab ye 7 nahi dikhayega agar jobs delete ho gayi hain
    });
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ message: "Error fetching system stats" });
  }
};

// 2. GET ALL STUDENTS
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password");
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students list" });
  }
};

// 3. GET ALL COMPANIES
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await User.find({ role: "company" }).select("-password");
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: "Error fetching companies list" });
  }
};

// 4. DELETE ANY USER (Student or Company)
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    // User delete ke saath uski sari applications bhi delete
    // Find user first so we can remove resume file if present
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete associated applications
    await Application.deleteMany({ student: userId });

    // Remove resume file from disk if exists
    if (user.resume) {
      const resumePath = path.join(__dirname, "..", "uploads", user.resume);
      try {
        if (fs.existsSync(resumePath)) {
          await fs.promises.unlink(resumePath);
        }
      } catch (fileErr) {
        console.error("Error deleting resume file:", fileErr);
      }
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User and their applications removed." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};

// 5. GET ALL JOBS
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching job listings" });
  }
};

// 6. DELETE A JOB
exports.deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    // Job delete ke saath us job pe aayi sari applications bhi delete
    await Application.deleteMany({ job: jobId });
    await Job.findByIdAndDelete(jobId);
    
    res.status(200).json({ message: "Job and its applications deleted." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting job" });
  }
};

// --- Get All Admins ---
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("-password");
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admins" });
  }
};

// --- Get All Applications (Detailed for Admin) ---
exports.getAllApplications = async (req, res) => {
  try {
    // 🔥 FIX: "name email" hata do, taaki student ki _id bhi aaye
    const apps = await Application.find()
      .populate("student") 
      .populate("job");
    
    res.status(200).json(apps);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching applications" });
  }
};
// adminController.js
exports.deleteApplication = async (req, res) => {
  try {
    const appId = req.params.id;
    const application = await Application.findById(appId);
    if (!application) return res.status(404).json({ message: "Application not found" });

    // Only delete the application document; do NOT delete the student/user
    await Application.findByIdAndDelete(appId);
    res.json({ message: "Application entry removed!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting application" });
  }
};