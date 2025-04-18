const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes"); // Add this import for contact routes
const profileRoutes = require("./routes/profileRoutes"); // Add this import for profile routes
const adminRoutes = require("./routes/adminRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// Database connection
db.connect();

// Routes
app.use("/api/auth", authRoutes); // Auth routes
app.use("/api", contactRoutes); // Contact routes
app.use("/api", profileRoutes); // Add this line to use profile routes
app.use("/api/admin", adminRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is 🏃‍➡️ on port ${PORT}`);
});
