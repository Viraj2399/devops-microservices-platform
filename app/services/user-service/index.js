import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Fix __dirname issue in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const app = express();

// ✅ Enable CORS (Safe for Vite frontend on port 8080)
app.use(
  cors({
    origin: [
      "http://localhost:8080",           // local dev
      "http://localhost:5173",           // vite dev
      "http://20.44.200.207",            // ← your frontend external IP
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

// ✅ Initialize Supabase Client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// ✅ Top-Level Await Connection Test
try {
  const { error } = await supabase.from("users").select("*").limit(1);

  if (error) throw error;

  console.log("✅ Supabase connected successfully");
} catch (error) {
  console.error("❌ Supabase connection failed:", error.message);
  process.exit(1);
}

// Health Check Route
app.get("/health", (req, res) => {
  res.json({ status: "User Service running ✅" });
});

// Get All Users
app.get("/users", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create New User
app.post("/users", async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({
        error: "Username and email are required",
      });
    }

    const { data, error } = await supabase
      .from("users")
      .insert([{ username, email }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`✅ User Service running on port ${PORT}`);
});
