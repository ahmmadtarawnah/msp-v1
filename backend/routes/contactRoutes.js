const express = require("express");
const { submitContactForm } = require("../controllers/contactController");

const router = express.Router();

// Route to handle the contact form submission
router.post("/contact-us", submitContactForm);

module.exports = router;
