const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// REGISTER
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  await pool.query(
    "INSERT INTO users (email, password) VALUES ($1, $2)",
    [email, hash]
  );

  res.json({ message: "User created" });
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
  const user = result.rows[0];

  if (!user) return res.status(400).json("User not found");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json("Wrong password");

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

  res.json({ token });
});

// SAVE SEARCH
app.post("/search", async (req, res) => {
  const { token, city, maxPrice, rooms } = req.body;

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  await pool.query(
    "UPDATE users SET city=$1, max_price=$2, rooms=$3 WHERE id=$4",
    [city, maxPrice, rooms, decoded.id]
  );

  res.json({ message: "Search saved" });
});

app.listen(5000, () => console.log("Server läuft auf 5000"));