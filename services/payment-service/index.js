const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const app = express();

// ✅ Enable CORS (VERY IMPORTANT)
app.use(cors({
  origin: "*", // later you can restrict this
}));

app.use(express.json());

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// ✅ Safe startup connection test
(async () => {
  try {
    const { error } = await supabase
      .from("payments")
      .select("*")
      .limit(1);

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

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json(error);
    }

    res.json(data);
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: err.message });
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

    if (error) {
      console.error("Insert error:", error);
      return res.status(500).json(error);
    }

    res.status(201).json(data);
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3003, () =>
  console.log("Payment Service running on port 3003")
);