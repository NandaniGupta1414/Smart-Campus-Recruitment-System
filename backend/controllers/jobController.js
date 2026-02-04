// const Job = require("../models/job");
// const Application = require("../models/Application");

// // ================= COMPANY CREATES A JOB =================
// const createJob = async (req, res) => {
//   try {
//     // Sirf wahi 4 fields lo jo frontend se aa rahi hain
//     const { title, location, salary, description } = req.body;

//     // Validation
//     if (!title || !location || !salary || !description) {
//       return res.status(400).json({ message: "All required fields (Title, Location, Salary, Description) must be filled" });
//     }

//     const job = await Job.create({
//       title,
//       location,
//       salary,
//       description,
//       companyName: req.user.name, 
//       createdBy: req.user._id,    
//     });

//     res.status(201).json({ message: "Job posted successfully", job });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
// // ================= GET ALL JOBS (FOR STUDENTS) =================
// const getAllJobs = async (req, res) => {
//   try {
//     const jobs = await Job.find().sort({ createdAt: -1 });
//     res.json(jobs);
//   } catch (error) {
//     res.status(500).json({ message: "Server error while fetching jobs" });
//   }
// };

// // ================= COMPANY VIEW OWN JOBS =================
// const getCompanyJobs = async (req, res) => {
//   try {
//     // ✅ FIXED: Using 'createdBy' to fetch company specific jobs
//     const jobs = await Job.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
//     res.json(jobs);
//   } catch (error) {
//     res.status(500).json({ message: "Server error while fetching company jobs" });
//   }
// };

// // ================= COMPANY VIEW APPLICANTS =================
// const getApplicantsForCompany = async (req, res) => {
//   try {
//     const companyId = req.user._id;

//     const applications = await Application.find()
//       .populate("student", "name email phone university branch collegeId skills resume githubLink linkedinLink projectDescription xthMarks xiithMarks gradMarks xthBoard xiithBoard course")
//       .populate({
//         path: "job",
//         match: { createdBy: companyId }, // ✅ FIXED: Match using 'createdBy'
//         select: "title companyName",
//       });

//     // Filter applications that actually belong to this company's jobs
//     const filtered = applications.filter(app => app.job !== null);

//     res.json(filtered);
//   } catch (error) {
//     console.error("Fetch Applicants Error:", error);
//     res.status(500).json({ message: "Server error while fetching applicants" });
//   }
// };

// // ================= STUDENT APPLY FOR JOB =================
// const applyForJob = async (req, res) => {
//   try {
//     const jobId = req.params.jobId || req.body.jobId;
//     const studentId = req.user._id;

//     // 1. Check if already applied
//     const alreadyApplied = await Application.findOne({ job: jobId, student: studentId });
//     if (alreadyApplied) return res.status(400).json({ message: "Already applied!" });

//     // 2. Create Application
//     const application = await Application.create({
//       job: jobId,
//       student: studentId,
//       status: "applied",
//     });

//     // 3. 🔥 UPDATE JOB (Ye line tumhare code mein miss thi)
//     await Job.findByIdAndUpdate(jobId, {
//       $addToSet: { appliedBy: studentId } 
//     });

//     res.status(201).json({ message: "Applied successfully", application });
//   } catch (error) {
//     res.status(500).json({ message: "Error while applying" });
//   }
// };
// const deleteJob = async (req, res) => {
//   try {
//     const jobId = req.params.id;

//     // 1. Pehle check karo job exist karti hai ya nahi
//     const job = await Job.findById(jobId);
//     if (!job) return res.status(404).json({ message: "Job not found" });

//     // 2. 🔥 CASCADE DELETE: Is Job ki sari applications uda do
//     await Application.deleteMany({ job: jobId });

//     // 3. Ab Job ko uda do
//     await Job.findByIdAndDelete(jobId);

//     res.status(200).json({ message: "Job and all related applications deleted! 🗑️" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error while deleting job" });
//   }
// };

// module.exports = { 
//   createJob, 
//   getAllJobs, 
//   applyForJob, 
//   getApplicantsForCompany, 
//   getCompanyJobs ,
//   deleteJob
// };

const Job = require("../models/job");
const Application = require("../models/Application");

// ================= COMPANY CREATES A JOB =================
const createJob = async (req, res) => {
  try {
    const { title, location, salary, description } = req.body;
    if (!title || !location || !salary || !description) {
      return res.status(400).json({ message: "All required fields (Title, Location, Salary, Description) must be filled" });
    }

    const job = await Job.create({
      title,
      location,
      salary,
      description,
      companyName: req.user.name, 
      createdBy: req.user._id,    
    });

    res.status(201).json({ message: "Job posted successfully", job });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET ALL JOBS (FOR STUDENTS) =================
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching jobs" });
  }
};

// ================= COMPANY VIEW OWN JOBS =================
const getCompanyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching company jobs" });
  }
};

// ================= COMPANY VIEW APPLICANTS =================
const getApplicantsForCompany = async (req, res) => {
  try {
    const companyId = req.user._id;
    const applications = await Application.find()
      .populate("student", "name email phone university branch collegeId skills resume githubLink linkedinLink projectDescription xthMarks xiithMarks gradMarks xthBoard xiithBoard course")
      .populate({
        path: "job",
        match: { createdBy: companyId },
        select: "title companyName",
      });

    const filtered = applications.filter(app => app.job !== null);
    res.json(filtered);
  } catch (error) {
    console.error("Fetch Applicants Error:", error);
    res.status(500).json({ message: "Server error while fetching applicants" });
  }
};

// ================= STUDENT APPLY FOR JOB =================
const applyForJob = async (req, res) => {
  try {
    const jobId = req.params.jobId || req.body.jobId;
    const studentId = req.user._id;

    const alreadyApplied = await Application.findOne({ job: jobId, student: studentId });
    if (alreadyApplied) return res.status(400).json({ message: "Already applied!" });

    const application = await Application.create({
      job: jobId,
      student: studentId,
      status: "applied",
    });

    await Job.findByIdAndUpdate(jobId, {
      $addToSet: { appliedBy: studentId } 
    });

    res.status(201).json({ message: "Applied successfully", application });
  } catch (error) {
    res.status(500).json({ message: "Error while applying" });
  }
};

// ================= 🔥 REMOVE SINGLE APPLICANT (FIXED) =================
const removeApplicant = async (req, res) => {
  try {
    const { id } = req.params; // Application ID

    const application = await Application.findById(id);
    if (!application) return res.status(404).json({ message: "Application not found" });

    const jobId = application.job;
    const studentId = application.student;

    // ✅ FIX: Sirf ye specific application delete hogi
    // Isse user ka account aur dusri jobs safe rahengi
    await Application.findByIdAndDelete(id);

    // ✅ FIX: Job ke list se user ID nikal do
    await Job.findByIdAndUpdate(jobId, {
      $pull: { appliedBy: studentId }
    });

    res.status(200).json({ message: "Applicant removed from this specific job! ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while removing applicant" });
  }
};

// ================= DELETE ENTIRE JOB =================
// const deleteJob = async (req, res) => {
//   try {
//     const jobId = req.params.id;
//     const job = await Job.findById(jobId);
//     if (!job) return res.status(404).json({ message: "Job not found" });

//     // Isse sirf is job ki applications jayengi
//     await Application.deleteMany({ job: jobId });
//     await Job.findByIdAndDelete(jobId);

//     res.status(200).json({ message: "Job and all related applications deleted! 🗑️" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error while deleting job" });
//   }
// };

// ================= DELETE ENTIRE JOB (FIXED) =================
const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // ❌ PURANI LINE: await Application.deleteMany({ job: jobId }); 
    // Is line ko maine hata diya hai taaki student ki history delete na ho.

    // ✅ SIRF JOB DELETE KARO
    await Job.findByIdAndDelete(jobId);

    res.status(200).json({ message: "Job post removed! Student application history preserved. 🗑️" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while deleting job" });
  }
};

module.exports = { 
  createJob, 
  getAllJobs, 
  applyForJob, 
  getApplicantsForCompany, 
  getCompanyJobs,
  deleteJob,
  removeApplicant 
};