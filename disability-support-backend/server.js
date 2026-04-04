require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ DB Error:", err.message));

// ✅ User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  role: { type: String, default: "user" }
});

const User = mongoose.model("User", userSchema);

// ✅ Register API
app.post("/api/users", async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = new User({
      name,
      email,
      password,
      phone,
      role
    });

    await user.save();

    res.json({ message: "User saved successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error saving user" });
  }
});

// ✅ Server (IMPORTANT FOR RENDER)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});