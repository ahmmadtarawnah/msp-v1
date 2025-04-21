const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { authenticate, isAdmin, isLawyer } = require("../controllers/authController");
const {
  submitApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  getApplicationByUserId,
  getApprovedLawyers,
  deleteApplication,
  updatePersonalPic
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

// Get approved lawyers (public access)
router.get("/approved", async (req, res, next) => {
  console.log("Getting approved lawyers..."); // Debug log
  next();
}, getApprovedLawyers);

// Get application by user ID (for lawyers and applicants)
router.get("/user/:userId", authenticate, isLawyer, getApplicationByUserId);

// Update personal picture (for lawyers and admins)
router.put("/user/:userId/personal-pic", authenticate, upload.single("personalPic"), updatePersonalPic);

// Admin routes
router.use(authenticate);
router.use(isAdmin);

router.get("/", getAllApplications);
router.get("/:id", getApplicationById);
router.put("/:id/status", updateApplicationStatus);
router.put("/:id/personal-pic", upload.single("personalPic"), updatePersonalPic);
router.delete("/:id", deleteApplication);

module.exports = router; 