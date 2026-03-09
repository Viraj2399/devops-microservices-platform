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
      .from("orders")
      .select("*")
      .limit(1);

    if (error) throw error;
    console.log("✅ Supabase connected successfully");
  } catch (error) {
    console.error("❌ Error connecting to Supabase:", error.message);
  }
})();

app.get("/health", (req, res) => {
  res.json({ status: "Order Service running ✅" });
});

app.get("/orders", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("orders")
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

app.post("/orders", async (req, res) => {
  try {
    const { product_id, user_id, quantity } = req.body;

    const { data, error } = await supabase
      .from("orders") // ✅ Fixed: was "users", should be "orders"
      .insert([{ product_id, user_id, quantity }]) // ✅ Fixed: correct fields
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

app.listen(3002, () =>
  console.log("Order Service running on port 3002")
);