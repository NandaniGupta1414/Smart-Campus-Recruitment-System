const express = require("express");
const router = express.Router();

const {
  createJob,
  getAllJobs,
  applyForJob,
  getApplicantsForCompany,
  getCompanyJobs,
  deleteJob,
  removeApplicant,
} = require("../controllers/jobController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Company posts a job
router.post("/", protect, authorizeRoles("company"), createJob);

// Student - view all jobs
router.get("/", protect, authorizeRoles("student"), getAllJobs);

// Student - apply for job
router.post(
  "/:jobId/apply",
  protect,
  authorizeRoles("student"),
  applyForJob
);
// Company - view applicants
router.get(
  "/company/applicants",
  protect,
  authorizeRoles("company"),
  getApplicantsForCompany
);

// Company - view own jobs
router.get("/company", protect, authorizeRoles("company"), getCompanyJobs);

router.delete("/:id", protect, authorizeRoles("company"), deleteJob);
// 2. 🔥 NAYA ROUTE: Sirf ek student ko hatane ke liye (Demerit Fix)
router.delete("/applicant/:id", protect, authorizeRoles("company", "admin"), removeApplicant);

// Student - apply for job (Supports both styles)
router.post("/apply", protect, authorizeRoles("student"), applyForJob); // For body {jobId}
router.post("/:jobId/apply", protect, authorizeRoles("student"), applyForJob); // For params
module.exports = router;
