

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
    
     deleteApplication,
     downloadReport
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
router.get("/report/download", downloadReport);

module.exports = router;