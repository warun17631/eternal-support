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

/* ================= UPDATED SCHEMA ================= */

const requestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number },
  gender: { type: String },
  country: { type: String, required: true }, // Added field
  location: { type: String, required: true }, // City/Location
  email: { type: String, required: true },
  phone: { type: String, required: true },
  needService: { type: String },
  note: { type: String }
}, { 
  timestamps: true // Automatically creates createdAt and updatedAt
});

const Request = mongoose.model("Request", requestSchema);

/* ================= API ROUTES ================= */

// ✅ Create Request API
app.post("/api/requests", async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      country,    // Added
      location,
      email,
      phone,
      needService,
      note
    } = req.body;

    // ✅ Enhanced Validation
    if (!name || !email || !phone || !country || !location) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing: Name, Email, Phone, Country, and Location are mandatory."
      });
    }

    const newRequest = new Request({
      name,
      age,
      gender,
      country,
      location,
      email,
      phone,
      needService,
      note
    });

    await newRequest.save();

    res.status(201).json({
      success: true,
      message: "✅ Request saved successfully"
    });

  } catch (err) {
    console.error("Submission Error:", err);
    res.status(500).json({
      success: false,
      message: "❌ Server Error: Unable to save request"
    });
  }
});

// ✅ GET API (Optional: To view requests for testing)
app.get("/api/requests", async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Error fetching requests" });
  }
});

/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});