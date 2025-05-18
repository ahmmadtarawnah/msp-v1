const express = require("express");
const { submitContactForm, getAllContacts } = require("../controllers/contactController");
const { authenticate, isAdmin } = require("../controllers/authController");

const router = express.Router();

// Route to handle the contact form submission
router.post("/", submitContactForm);

// Route to get all contact submissions (admin only)
router.get("/", authenticate, isAdmin, getAllContacts);

module.exports = router;
