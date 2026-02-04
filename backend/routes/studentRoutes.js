// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const User = require("../models/user");
// const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// // 1. Multer Storage Configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     // Unique name using user name and timestamp
//     const userName = req.user.name.replace(/\s+/g, '_').toLowerCase();
//     const timestamp = Date.now();
//     const ext = file.originalname.split(".").pop();
//     cb(null, `${userName}-${timestamp}.${ext}`);
//   },
// });

// const upload = multer({ 
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype === "application/pdf") {
//       cb(null, true);
//     } else {
//       cb(new Error("Only PDF files are allowed"), false);
//     }
//   }
// });

// // 2. PUT: Update Student Profile (Including New Fields)
// router.put("/profile", protect, authorizeRoles("student"), upload.single("resume"), async (req, res) => {
//   try {
//     const { 
//       course, 
//       branch, 
//       university, 
//       collegeId, 
//       projectDescription, 
//       githubLink, 
//       linkedinLink, 
//       skills 
//     } = req.body;

//     const user = await User.findById(req.user._id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Fields update
//     user.course = course;
//     user.branch = branch;
//     user.university = university;
//     user.collegeId = collegeId;
//     user.projectDescription = projectDescription;
//     user.githubLink = githubLink;
//     user.linkedinLink = linkedinLink;

//     // Skills conversion (String to Array)
//     if (skills) {
//       user.skills = skills.split(",").map(s => s.trim()).filter(s => s.length > 0);
//     }

//     // Resume file update
//     if (req.file) {
//       user.resume = req.file.filename;
//     }

//     user.profileCompleted = true; 
//     await user.save();

//     res.json({ message: "Profile updated successfully!", user });
//   } catch (error) {
//     console.error("Profile update error:", error);
//     res.status(500).json({ message: "Server error during profile update." });
//   }
// });

// // 3. GET: Fetch Student Profile
// router.get("/profile", protect, authorizeRoles("student"), async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select("-password");
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("../models/user");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => { cb(null, "uploads/"); },
//   filename: (req, file, cb) => {
//     const userName = req.user.name.replace(/\s+/g, '_').toLowerCase();
//     cb(null, `${userName}-${Date.now()}.pdf`);
//   },
// });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // 1. Safe way to get user name
    const namePart = req.user && req.user.name 
      ? req.user.name.replace(/\s+/g, '_').toLowerCase() 
      : "student";

    // 2. Extension extract karo (taaki 'file' variable use ho jaye aur warning hat jaye)
    const ext = file.originalname.split('.').pop(); 

    // 3. Final filename: nandani_kumari-1706654400.pdf
    cb(null, `${namePart}-${Date.now()}.${ext}`);
  },
});

const upload = multer({ storage });

// 🔥 YE HAI UPDATE LOGIC
// 🔥 UPDATED PUT ROUTE (studentRoutes.js)
router.put("/profile", protect, authorizeRoles("student"), upload.single("resume"), async (req, res) => {
  try {
    const { 
      name, phone, course, specialization, university, collegeId, projectDescription, 
      githubLink, linkedinLink, skills, xthBoard, xthMarks, 
      xiithBoard, xiithMarks, gradMarks 
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Fields Update
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.course = course || user.course;
    user.specialization = specialization || user.specialization; 
    user.university = university || user.university;
    user.collegeId = collegeId || user.collegeId;
    user.projectDescription = projectDescription || user.projectDescription;
    user.githubLink = githubLink || user.githubLink;
    user.linkedinLink = linkedinLink || user.linkedinLink;
    user.xthBoard = xthBoard || user.xthBoard;
    user.xthMarks = xthMarks || user.xthMarks;
    user.xiithBoard = xiithBoard || user.xiithBoard;
    user.xiithMarks = xiithMarks || user.xiithMarks;
    user.gradMarks = gradMarks || user.gradMarks;

    if (skills) {
      user.skills = skills.split(",").map(s => s.trim());
    }
    if (req.file) {
      user.resume = req.file.filename;
    }
// 🔥 VERY IMPORTANT
user.profileCompleted = true;

    await user.save();
    const updatedUser = await User.findById(user._id).select("-password");
    res.json({ message: "Profile Updated! ✨", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Profile Fetch
router.get("/profile", protect, authorizeRoles("student"), async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;