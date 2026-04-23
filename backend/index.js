require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple request logger to help debugging on Render
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin || '-'} - IP: ${req.ip}`);
  if (req.body && Object.keys(req.body).length) console.log('  Body:', req.body);
  next();
});

// ------------------ DB CONNECTION ------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ------------------ MODELS ------------------
const User = mongoose.model("User", {
  name: String,
  email: { type: String, unique: true },
  password: String
});

const Grievance = mongoose.model("Grievance", {
  title: String,
  description: String,
  category: String,
  date: { type: Date, default: Date.now },
  status: { type: String, default: "Pending" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

// ------------------ AUTH MIDDLEWARE ------------------
const auth = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) return res.status(401).json("Access Denied");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch {
    res.status(400).json("Invalid Token");
  }
};

// ------------------ AUTH ROUTES ------------------

// REGISTER
// REGISTER
app.post("/api/register", async (req, res) => {
  try {
    console.log('Register route hit');
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json("Name, email and password are required");
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json("Email already exists");

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hash });

    res.json(user);
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json(err.message || 'Server error');
  }
});

// LOGIN
// LOGIN
app.post("/api/login", async (req, res) => {
  try {
    console.log('Login route hit');
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json("Email and password required");

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json("Invalid Email");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json("Invalid Password");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json(err.message || 'Server error');
  }
});

// ------------------ GRIEVANCE ROUTES ------------------

// CREATE
app.post("/api/grievances", auth, async (req, res) => {
  const grievance = await Grievance.create({
    ...req.body,
    userId: req.user.id
  });
  res.json(grievance);
});

// GET ALL
app.get("/api/grievances", auth, async (req, res) => {
  const data = await Grievance.find({ userId: req.user.id });
  res.json(data);
});

// GET BY ID
app.get("/api/grievances/:id", auth, async (req, res) => {
  const data = await Grievance.findById(req.params.id);
  res.json(data);
});

// UPDATE
app.put("/api/grievances/:id", auth, async (req, res) => {
  const updated = await Grievance.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// DELETE
app.delete("/api/grievances/:id", auth, async (req, res) => {
  await Grievance.findByIdAndDelete(req.params.id);
  res.json("Deleted");
});

// SEARCH
app.get("/api/grievances/search/title", auth, async (req, res) => {
  const { title } = req.query;

  const data = await Grievance.find({
    title: { $regex: title, $options: "i" }
  });

  res.json(data);
});

// ------------------ SERVER ------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));