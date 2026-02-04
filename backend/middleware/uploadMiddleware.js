const multer = require("multer");
const path = require("path");

// Storage settings: save resume as <username>-<timestamp>.<ext>
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const nameFromReq = (req.user && req.user.name) || req.body.name || "student";
    const namePart = nameFromReq.replace(/\s+/g, "_").toLowerCase();
    const ext = path.extname(file.originalname) || ".pdf";
    cb(null, `${namePart}-${Date.now()}${ext}`);
  },
});

// Only allow PDF resumes and limit size to 5MB
const fileFilter = (req, file, cb) => {
  const allowed = [".pdf"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error("Only PDF files are allowed"), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = upload;