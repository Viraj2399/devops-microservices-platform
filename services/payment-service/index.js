const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();
const app = express();
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

app.get("/health", (req, res) => {
  res.json({ status: "Payment Service running ✅" });
});

app.get("/payments", async (req, res) => {
  const result = await pool.query("SELECT * FROM payments");
  res.json(result.rows);
});

app.listen(3002, () => console.log("Payment Service running on port 3002"));
