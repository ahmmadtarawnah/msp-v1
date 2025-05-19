const LawyerApplication = require("../models/lawyerApplicationModel");
const User = require("../models/userModel");
const Appointment = require("../models/appointmentModel");
const Review = require("../models/reviewModel");

// Submit a lawyer application
const submitApplication = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);
    
    const { userId, barNumber, yearsOfExperience, specialization, about, hourlyRate, halfHourlyRate } = req.body;
    
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
      about,
      hourlyRate,
      halfHourlyRate,
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
      .populate("userId", "name username email")
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
      .populate("userId", "name username email");

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

// Get application by user ID
const getApplicationByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if the user is trying to access their own application or is an admin
    if (req.userId !== userId && req.userRole !== "admin") {
      return res.status(403).json({ message: "You can only access your own application" });
    }

    const application = await LawyerApplication.findOne({ userId })
      .populate("userId", "name username email");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    res.status(500).json({ message: "Server error while fetching application" });
  }
};

// Get approved lawyers for public access
const getApprovedLawyers = async (req, res) => {
  try {
    console.log("Fetching approved lawyers..."); // Debug log
    const lawyers = await LawyerApplication.find({ status: "approved" })
      .populate("userId", "name username email")
      .select("-certificationPic -createdAt -__v")
      .sort({ yearsOfExperience: -1 });
    
    console.log("Found lawyers:", lawyers); // Debug log
    res.status(200).json(lawyers);
  } catch (error) {
    console.error("Error fetching approved lawyers:", error);
    res.status(500).json({ message: "Server error while fetching approved lawyers" });
  }
};

// Delete lawyer application
const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await LawyerApplication.findById(id);
    
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // If the application was approved, update the user's role back to user
    if (application.status === "approved") {
      // Delete all appointments for this lawyer
      await Appointment.deleteMany({ lawyerId: application.userId });
      
      // Delete all reviews for this lawyer
      await Review.deleteMany({ lawyerId: application.userId });
      
      // Update user role back to user
      await User.findByIdAndUpdate(application.userId, { role: "user" });
    }

    // Delete the application
    await LawyerApplication.findByIdAndDelete(id);
    
    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({ message: "Server error while deleting application" });
  }
};

// Update personal picture
const updatePersonalPic = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if the user is trying to update their own picture or is an admin
    if (req.userId !== userId && req.userRole !== "admin") {
      return res.status(403).json({ message: "You can only update your own profile picture" });
    }

    // Find the application by userId
    const application = await LawyerApplication.findOne({ userId });
    
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    // Update the personal picture
    application.personalPic = req.file.filename;
    await application.save();

    res.status(200).json(application);
  } catch (error) {
    console.error("Error updating personal picture:", error);
    res.status(500).json({ message: "Server error while updating personal picture" });
  }
};

module.exports = {
  submitApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  getApplicationByUserId,
  getApprovedLawyers,
  deleteApplication,
  updatePersonalPic
}; 