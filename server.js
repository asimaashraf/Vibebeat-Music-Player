const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const path = require("path");
const open = (...args) => import("open").then((m) => m.default(...args));
const Contact = require("./models/Contact");
const User = require("./models/User");

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Static pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "contacts", "contact.html"));
});

// ✅ Connect MongoDB
mongoose.connect("mongodb://localhost:27017/vibebeat")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ MongoDB Error", err));

// 🔐 Signup
app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, gender, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.json({ success: false, message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      gender,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.json({ success: true, message: "Signup successful" });
  } catch (err) {
    res.json({ success: false, message: "Error during signup" });
  }
});

// 🔑 Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.json({ success: false, message: "Invalid password" });

    res.json({ success: true, message: "Login successful" });
  } catch (err) {
    res.json({ success: false, message: "Error during login" });
  }
});
// Contact form submission
app.post("/contact", async (req, res) => {
   console.log("Received data:", req.body); 
  try {
    const { name, email, phone, message } = req.body;
    const contact = new Contact({ name, email, phone, message });
    await contact.save();
    res.status(201).json({ message: "✅ Message sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "❌ Server error", error: err.message });
  }
});

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
  open("http://localhost:5000");
});
