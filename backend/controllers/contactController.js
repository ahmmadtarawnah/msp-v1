const Contact = require("../models/contactModel");

const submitContactForm = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  try {
    // Create a new contact document
    const newContact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
    });

    // Save the contact form to the database
    await newContact.save();

    // Respond with a success message
    res.status(200).json({ message: "Your message has been received!" });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res
      .status(500)
      .json({ message: "An error occurred while submitting the form" });
  }
};

module.exports = { submitContactForm };
