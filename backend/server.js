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

connectDB();

const app = express();

// CORS
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

app.use(express.json());

// API Routes
app.use("/api/projects", projectRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/shop", productRoutes);        // Shop is active
app.use("/api/orders", orderRoutes);        // Orders route is active (but payments disabled)
app.use("/api/newsletter", newsletterRoutes);

// Health check
app.get("/api/health", (_, res) => res.json({ status: "OK" }));

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});