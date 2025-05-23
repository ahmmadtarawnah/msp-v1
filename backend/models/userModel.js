const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Ensure `name` field is defined in the schema
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["user", "lawyer", "admin"],
    default: "user" 
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
