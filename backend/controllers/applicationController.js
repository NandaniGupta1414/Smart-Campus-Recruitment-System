const Application = require("../models/Application");
const Job = require("../models/job");

// ================= STUDENT APPLY FOR JOB =================
const applyForJob = async (req, res) => {
  try {
    // 🔥 FIX 1: req.params ki jagah req.body use karo kyunki frontend se body mein aa raha hai
    const { jobId } = req.body; 

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    // 🔥 FIX 2: Check strictly for THIS student and THIS job
    const alreadyApplied = await Application.findOne({
      student: req.user._id,
      job: jobId,
    });

    if (alreadyApplied) {
      return res.status(400).json({ message: "You have already applied for this job" });
    }

    const application = await Application.create({
      student: req.user._id,
      job: jobId,
      status: "applied",
    });

    res.status(201).json({ message: "Applied successfully! ", application });
  } catch (error) {
    console.error("Apply Error:", error);
    res.status(500).json({ message: "Server error during application" });
  }
};

// ================= COMPANY VIEW APPLICATIONS =================
const getCompanyApplications = async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user._id });
    if (!jobs || jobs.length === 0) {
      return res.json([]);
    }
    const jobIds = jobs.map((job) => job._id);
    const applications = await Application.find({ job: { $in: jobIds } })
    .populate("student", "name email phone university course collegeId skills resume githubLink linkedinLink projectDescription xthMarks xiithMarks gradMarks xthBoard xiithBoard") 
    .populate("job", "title companyName");
    res.json(applications);
  } catch (error) {
    console.error("Fetch Apps Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= UPDATE STATUS & INTERVIEW =================
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, interviewDate, interviewTime, interviewLink } = req.body;
    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) return res.status(404).json({ message: "Not found" });

    application.status = status;
    if (status === "shortlisted") {
      application.interviewDate = interviewDate;
      application.interviewTime = interviewTime;
      application.interviewLink = interviewLink;
    }
    await application.save();
    res.json({ message: "Status updated with Interview details", application });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= STUDENT VIEW THEIR APPS =================
const getStudentApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate("job", "title companyName location salary")
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= COMPANY STATS =================
const getCompanyStats = async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user._id });
    const jobIds = jobs.map(j => j._id);
    const totalJobs = jobs.length;
    const totalApplications = await Application.countDocuments({ job: { $in: jobIds } });
    const shortlisted = await Application.countDocuments({ job: { $in: jobIds }, status: "shortlisted" });
    const rejected = await Application.countDocuments({ job: { $in: jobIds }, status: "rejected" });
    res.json({ totalJobs, totalApplications, shortlisted, rejected });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= STUDENT WITHDRAW APPLICATION =================
const withdrawApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user._id;

    // ✅ Check if application exists AND belongs to this student
    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.student.toString() !== studentId.toString()) {
      return res.status(403).json({ message: "Not authorized to withdraw this application" });
    }

    // ✅ Delete the application
    await Application.findByIdAndDelete(id);

    res.json({ 
      message: "Application withdrawn successfully! You can apply again.", 
      applicationId: id 
    });
  } catch (error) {
    console.error("Withdraw Error:", error);
    res.status(500).json({ message: "Server error while withdrawing application" });
  }
};

module.exports = { applyForJob, getCompanyApplications, updateApplicationStatus, getStudentApplications, getCompanyStats, withdrawApplication };