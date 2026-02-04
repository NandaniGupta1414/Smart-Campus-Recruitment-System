// const express = require("express");
// const router = express.Router();
// const { registerUser, loginUser , getMyProfile ,forgotPassword, resetPassword } = require("../controllers/authController");
// const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// // register route
// router.post("/register", registerUser);

// // login route
// router.post("/login", loginUser);

// //  Test protected routes (add below)
// router.get(
//   "/student-dashboard",
//   protect,
//   authorizeRoles("student"),
//   (req, res) => {
//     res.json({ message: `Welcome Student ${req.user.name}` });
//   }
// );

// router.get(
//   "/company-dashboard",
//   protect,
//   authorizeRoles("company"),
//   (req, res) => {
//     res.json({ message: `Welcome Company ${req.user.name}` });
//   }
// );

// // admin dashboard (protected)
// router.get(
//   "/admin-dashboard",
//   protect,
//   authorizeRoles("admin"),
//   (req, res) => {
//     res.json({ message: "Welcome Admin Dashboard" });
//   }
// );

// // const { getMyProfile } = require("../controllers/authController");

// router.get("/me", protect, getMyProfile);
// // Add these routes
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password", resetPassword);


// module.exports = router;

const express = require("express");
const router = express.Router();
// 🔥 1. updateProfile ko yahan import list mein add karo
const { registerUser, loginUser , getMyProfile, updateProfile, forgotPassword, resetPassword } = require("../controllers/authController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware"); // 🔥 2. Upload middleware zaroori hai

// register route
router.post("/register", registerUser);

// login route
router.post("/login", loginUser);

// 🔥 3. YAHI MISSING THA: Profile Update Route
// Iske bina 404 error kabhi nahi jayega
router.put("/profile", protect, upload.single("resume"), updateProfile);

router.get("/me", protect, getMyProfile);

// Test protected routes
router.get("/student-dashboard", protect, authorizeRoles("student"), (req, res) => {
    res.json({ message: `Welcome Student ${req.user.name}` });
});

router.get("/company-dashboard", protect, authorizeRoles("company"), (req, res) => {
    res.json({ message: `Welcome Company ${req.user.name}` });
});

router.get("/admin-dashboard", protect, authorizeRoles("admin"), (req, res) => {
    res.json({ message: "Welcome Admin Dashboard" });
});

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;