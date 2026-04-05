require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err.message));

/* ================= EMAIL SETUP ================= */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/* ================= SCHEMA ================= */

const requestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  gender: String,
  country: { type: String, required: true },
  location: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  needService: String,
  note: String
}, { timestamps: true });

const Request = mongoose.model("Request", requestSchema);

/* ================= API ================= */

app.post("/api/requests", async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      country,
      location,
      email,
      phone,
      needService,
      note
    } = req.body;

    // ✅ Validation
    if (!name || !email || !phone || !country || !location) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    // ✅ Save to DB
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

    /* ================= SEND EMAIL TO USER ================= */

    await transporter.sendMail({
      from: `"Eternal Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank You for Contacting Eternal Support 💙",
      html: `
        <h2>Hello ${name},</h2>
        <p>Thank you for contacting <b>Eternal Support Services</b>.</p>
        <p><b>Service:</b> ${needService || "General Support"}</p>
        <p><b>Location:</b> ${location}, ${country}</p>
        <p>We will contact you soon.</p>
        <br/>
        <p>Regards,<br/>Eternal Support Team</p>
      `
    });

    /* ================= SEND EMAIL TO ADMIN ================= */

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // admin email
      subject: "📩 New Support Request Received",
      html: `
        <h2>New Request</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Country:</b> ${country}</p>
        <p><b>Location:</b> ${location}</p>
        <p><b>Service:</b> ${needService}</p>
        <p><b>Note:</b> ${note}</p>
      `
    });

    /* ================= RESPONSE ================= */

    res.status(201).json({
      success: true,
      message: "✅ Request saved & Emails sent"
    });

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      success: false,
      message: "❌ Server error"
    });
  }
});

/* ================= GET ================= */

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