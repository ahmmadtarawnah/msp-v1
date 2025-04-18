const LawyerApplication = require("../models/lawyerApplicationModel");
const User = require("../models/userModel");

// Submit a lawyer application
const submitApplication = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);
    
    const { userId, barNumber, yearsOfExperience, specialization } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Check if user already has a pending application
    const existingApplication = await LawyerApplication.findOne({
      userId,
      status: "pending"
    });

    if (existingApplication) {
      return res.status(400).json({ message: "You already have a pending application" });
    }

    // Check if files were uploaded
    if (!req.files || !req.files.certificationPic || !req.files.personalPic) {
      return res.status(400).json({ message: "Both certification and personal pictures are required" });
    }

    // Create new application
    const application = new LawyerApplication({
      userId,
      barNumber,
      yearsOfExperience,
      specialization,
      certificationPic: req.files.certificationPic[0].filename,
      personalPic: req.files.personalPic[0].filename
    });

    await application.save();
    res.status(201).json({ message: "Application submitted successfully", application });
  } catch (error) {
    console.error("Detailed error submitting application:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      message: "Server error while submitting application",
      error: error.message 
    });
  }
};

// Get all applications (for admin)
const getAllApplications = async (req, res) => {
  try {
    const applications = await LawyerApplication.find()
      .populate("userId", "name username")
      .sort({ createdAt: -1 });
    
    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Server error while fetching applications" });
  }
};

// Get application by ID
const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await LawyerApplication.findById(id)
      .populate("userId", "name username");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    res.status(500).json({ message: "Server error while fetching application" });
  }
};

// Update application status (approve/reject)
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await LawyerApplication.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    await application.save();

    // If approved, update user role to lawyer
    if (status === "approved") {
      await User.findByIdAndUpdate(application.userId, { role: "lawyer" });
    }

    res.status(200).json({ message: "Application status updated successfully", application });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ message: "Server error while updating application status" });
  }
};

module.exports = {
  submitApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus
}; 