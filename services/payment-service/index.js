const express = require("express");
const { Pool } = require("pg");
const app = express();
app.use(express.json());

const pool = new Pool({
  host: "localhost",
  user: "admin",
  password: "admin",
  database: "platformdb",
  port: 5432,
});

app.get("/health", (req, res) => {
  res.json({ status: "Payment Service running ✅" });
});

app.get("/payments", async (req, res) => {
  const result = await pool.query("SELECT * FROM payments");
  res.json(result.rows);
});

app.listen(3002, () => console.log("Payment Service running on port 3002"));
