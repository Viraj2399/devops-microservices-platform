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
  res.json({ status: "User Service running ✅" });
});

app.get("/users", async (req, res) => {
  const result = await pool.query("SELECT * FROM users");
  res.json(result.rows);
});

app.listen(3001, () => console.log("User Service running on port 3001"));
