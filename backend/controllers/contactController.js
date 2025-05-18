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

const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ dateSubmitted: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Error fetching contact submissions" });
  }
};

module.exports = { submitContactForm, getAllContacts };
