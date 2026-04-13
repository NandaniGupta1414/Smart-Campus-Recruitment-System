

const express = require("express");
const router = express.Router();
// 🔥 1. updateProfile ko yahan import list mein add karo
const {registerUser, loginUser , getMyProfile, updateProfile, forgotPassword, resetPassword ,sendRegisterOtp ,verifyRegisterOtp } = require("../controllers/authController");
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

router.post("/forget-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/send-register-otp", sendRegisterOtp);
router.post("/verify-register-otp", verifyRegisterOtp);

module.exports = router;