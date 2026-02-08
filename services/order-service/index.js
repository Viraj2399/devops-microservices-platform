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
  res.json({ status: "Order Service running ✅" });
});

app.get("/orders", async (req, res) => {
  const result = await pool.query("SELECT * FROM orders");
  res.json(result.rows);
});

app.listen(3003, () => console.log("Order Service running on port 3003"));
