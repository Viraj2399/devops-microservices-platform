const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const app = express();
app.use(express.json());

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Test connection on startup
(async () => {
  try {
    const { data, error } = await supabase.from("payments").select("count");
    if (error) throw error;
    console.log("✅ Supabase connected successfully");
  } catch (error) {
    console.error("❌ Error connecting to Supabase:", error.message);
  }
})();

app.get("/health", (req, res) => {
  res.json({ status: "Payment Service running ✅" });
});

app.get("/payments", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      error: "Database query failed",
      details: error.message,
    });
  }
});

app.post("/payments", async (req, res) => {
  try {
    const { amount, user_id } = req.body;
    
    const { data, error } = await supabase
      .from("payments")
      .insert([{ amount, user_id }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      error: "Failed to create payment",
      details: error.message,
    });
  }
});

app.listen(3002, () => console.log("Payment Service running on port 3002"));