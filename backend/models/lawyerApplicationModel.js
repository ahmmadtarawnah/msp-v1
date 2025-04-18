const mongoose = require("mongoose");

const lawyerApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  barNumber: {
    type: String,
    required: true
  },
  yearsOfExperience: {
    type: Number,
    required: true
  },
  specialization: {
    type: String,
    required: true,
    enum: [
      "Corporate Law",
      "Criminal Law",
      "Family Law",
      "Intellectual Property",
      "Real Estate",
      "Tax Law",
      "Immigration Law",
      "Personal Injury",
      "Employment Law"
    ]
  },
  certificationPic: {
    type: String, // URL to the stored image
    required: true
  },
  personalPic: {
    type: String, // URL to the stored image
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const LawyerApplication = mongoose.model("LawyerApplication", lawyerApplicationSchema);

module.exports = LawyerApplication; 