const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const { Pool } = require("pg");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://housing-project-self.vercel.app"
  ],
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.get("/", (req, res) => {
  res.send("Backend läuft 🚀");
});

// REGISTER
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Bitte E-Mail und Passwort eingeben." });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Das Passwort muss mindestens 8 Zeichen lang sein." });
    }

    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2)",
      [email, hash]
    );

    res.json({ message: "Registrierung erfolgreich! Du kannst dich jetzt einloggen." });
  } catch (err) {
    console.error("REGISTER ERROR:", err);

    if (err.code === "23505") {
      return res.status(400).json({ message: "Diese E-Mail ist bereits registriert." });
    }

    res.status(500).json({ message: "Fehler bei der Registrierung." });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT id, email, password, city, max_price, rooms FROM users WHERE email=$1",
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: "Benutzer nicht gefunden." });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(400).json({ message: "Falsches Passwort." });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login erfolgreich!",
      token,
      user: {
        email: user.email,
        city: user.city,
        maxPrice: user.max_price,
        rooms: user.rooms
      }
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Fehler beim Login." });
  }
});

// SAVE SEARCH
app.post("/search", async (req, res) => {
  try {
    const { token, city, maxPrice, rooms } = req.body;

    if (!token) {
      return res.status(401).json({ message: "Nicht eingeloggt." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await pool.query(
      "UPDATE users SET city=$1, max_price=$2, rooms=$3 WHERE id=$4",
      [city, maxPrice, rooms, decoded.id]
    );

    res.json({
      message: "Suchprofil erfolgreich gespeichert!",
      search: { city, maxPrice, rooms }
    });
  } catch (err) {
    console.error("SEARCH ERROR:", err);
    res.status(500).json({ message: "Fehler beim Speichern des Suchprofils." });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server läuft auf ${PORT}`);
});