const express = require("express");
const router = express.Router();

const {
  applyForJob,
  getCompanyApplications,
   updateApplicationStatus,
  getStudentApplications,
  getCompanyStats,
  withdrawApplication,
} = require("../controllers/applicationController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Student apply for job
router.post("/apply/:jobId", protect, authorizeRoles("student"), applyForJob);

// Company view applicants
router.get(
  "/company",
  protect,
  authorizeRoles("company"),
  getCompanyApplications
);


// Company - shortlist / reject applicant
router.put(
  "/:id/status",
  protect,
  authorizeRoles("company"),
  updateApplicationStatus
);

// Student views their applications
router.get(
  "/student",
  protect,
  authorizeRoles("student"),
  getStudentApplications
);

// Company dashboard stats
router.get(
  "/company/stats",
  protect,
  authorizeRoles("company"),
  getCompanyStats
);

// 🔥 Student withdraw/cancel application
router.delete(
  "/:id",
  protect,
  authorizeRoles("student"),
  withdrawApplication
);

module.exports = router;
