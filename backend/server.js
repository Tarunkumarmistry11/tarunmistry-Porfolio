require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Routes
const projectRoutes = require("./routes/projectRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
// const webhookRoutes = require("./routes/webhookRoutes"); // ← commented for now
const newsletterRoutes = require("./routes/newsletterRoutes");

const {razorpayWebhook} = require("./controllers/orderController"); // ← exported to be mounted in server.js

// ── STRIPE WEBHOOK (commented out — uncomment when STRIPE_SECRET_KEY is ready)
// IMPORTANT: stripeWebhook must be mounted BEFORE express.json() because
// Stripe requires the raw (unparsed) request body to verify the signature.
// Once express.json() runs, the raw body is gone.
// const { stripeWebhook } = require("./controllers/orderController");


connectDB();

const app = express();

// CORS — allow both localhost variants used by Vite
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Accept"],
    credentials: true,
  })
);

// WEBHOOK — raw body MUST come before express.json()
// Razorpay sends raw JSON; we need the Buffer for HMAC-SHA256 verification
// ══════════════════════════════════════════════════════════════════════════
app.post(
  "/api/orders/razorpay/webhook",
  express.raw({ type: "application/json" }),
  razorpayWebhook
);

app.use(express.json());

// API Routes
app.use("/api/projects", projectRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/shop", productRoutes);        // Shop is active
app.use("/api/orders", orderRoutes);        // Orders route is active (but payments disabled)
app.use("/api/newsletter", newsletterRoutes);

// Health check
app.get("/api/health", (_, res) => res.json({ status: "OK", timestamp: new Date().toISOString() }));

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`   Razorpay: ${process.env.RAZORPAY_KEY_ID ? "✓ configured" : "✗ RAZORPAY_KEY_ID missing"}`);
  console.log(`   Webhook:  ${process.env.RAZORPAY_WEBHOOK_SECRET  ? "✓" : "⚠ RAZORPAY_WEBHOOK_SECRET not set (ok for dev)"}`);
  console.log(`   Email:    ${process.env.SMTP_USER    ? "✓ configured" : "✗ SMTP_USER missing"}`);
  console.log(`   Supabase: ${process.env.SUPABASE_URL ? "✓ configured" : "✗ SUPABASE_URL missing"}`);
});