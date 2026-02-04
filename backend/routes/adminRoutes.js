// const express = require("express");
// const router = express.Router();
// const User = require("../models/user");
// const Job = require("../models/job");
// const Application = require("../models/Application");
// const { protect, authorizeRoles } = require("../middleware/authMiddleware");



// // --------------------
// // GET ALL USERS
// // --------------------
// router.get("/users", protect, authorizeRoles("admin"), async (req, res) => {
//   try {
//     const users = await User.find().select("-password"); // password hide
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // --------------------
// // GET ALL JOBS
// // --------------------
// router.get("/jobs", protect, authorizeRoles("admin"), async (req, res) => {
//   try {
//     const jobs = await Job.find().populate("postedBy", "name email role");
//     res.json(jobs);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // --------------------
// // DELETE A USER
// // --------------------
// router.delete("/users/:id", protect, authorizeRoles("admin"), async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     await user.deleteOne();
//     res.json({ message: "User deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // --------------------
// // DELETE A JOB
// // --------------------
// router.delete("/jobs/:id", protect, authorizeRoles("admin"), async (req, res) => {
//   try {
//     const job = await Job.findById(req.params.id);
//     if (!job) return res.status(404).json({ message: "Job not found" });

//     await job.deleteOne();
//     res.json({ message: "Job deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // --------------------
// // ADMIN DASHBOARD STATS
// // --------------------


// router.get("/stats", protect, authorizeRoles("admin"), async (req, res) => {
//   try {
//     const totalStudents = await User.countDocuments({ role: "student" });
//     const totalCompanies = await User.countDocuments({ role: "company" });
//     const totalJobs = await Job.countDocuments();
//     const totalApplications = await Application.countDocuments();

//     res.json({
//       totalStudents,
//       totalCompanies,
//       totalJobs,
//       totalApplications,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });


// module.exports = router;

const express = require("express");
const router = express.Router();
const { 
  getStats, 
  getAllStudents, 
  getAllCompanies, 
  deleteUser, 
  getAllJobs, 
  deleteJob,
  getAllAdmins,        // 🔥 Naya function
  getAllApplications,
    
     deleteApplication
} = require("../controllers/adminController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.use(protect);
router.use(authorizeRoles("admin"));

// --- 1. DASHBOARD STATS ---
router.get("/stats", getStats);

// --- 2. USER MANAGEMENT ---
router.get("/students", getAllStudents);
router.get("/companies", getAllCompanies);
router.get("/admins", getAllAdmins); // 🔥 Naya: Admins ki list dekhne ke liye
router.delete("/user/:id", deleteUser);

// --- 3. JOB MONITORING ---
router.get("/jobs", getAllJobs);
router.delete("/job/:id", deleteJob);

// --- 4. APPLICATION TRACKING ---
router.get("/applications", getAllApplications); 
// 🔥 Naya: Kaun kahan apply kiya
// adminRoutes.js mein niche ye route dalo
router.delete("/application/:id", deleteApplication); // Application udaane ke liye

module.exports = router;