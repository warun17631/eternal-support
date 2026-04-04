console.log("🔥 SERVER STARTING...");

require("dotenv").config(); // MUST be at top

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 DEBUG: check env loading
console.log("MONGO_URI:", process.env.MONGO_URI);

// ❌ If undefined → stop server
if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is NOT defined in .env");
  process.exit(1);
}

// ✅ MongoDB connection (FIXED)
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => {
  console.log("❌ DB Error:", err.message);
});

// Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  role: String
});

const User = mongoose.model("User", userSchema);

// Route
app.post("/api/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json({ message: "User saved successfully" });
  } catch (err) {
    console.log("❌ Save Error:", err);
    res.status(500).json({ message: "Error saving user" });
  }
});

// Server
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});