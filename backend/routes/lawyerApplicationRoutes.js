const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { authenticate, isAdmin } = require("../controllers/authController");
const {
  submitApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus
} = require("../controllers/lawyerApplicationController");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  }
});

// Public routes
router.post(
  "/submit",
  authenticate,
  upload.fields([
    { name: "certificationPic", maxCount: 1 },
    { name: "personalPic", maxCount: 1 }
  ]),
  submitApplication
);

// Admin routes
router.use(authenticate);
router.use(isAdmin);

router.get("/", getAllApplications);
router.get("/:id", getApplicationById);
router.put("/:id/status", updateApplicationStatus);

module.exports = router; 