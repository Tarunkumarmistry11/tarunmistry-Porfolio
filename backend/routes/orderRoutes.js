const express = require("express");
const router  = express.Router();

// Import only the active controllers — Stripe commented out until keys are ready
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getOrder,
} = require("../controllers/orderController");

// ── Razorpay (ACTIVE) ─────────────────────────────────────────────────────
// Step 1: frontend calls this to create a Razorpay order before opening the modal
router.post("/razorpay/create", createRazorpayOrder);

// Step 2: frontend calls this after user pays in the modal to verify + fulfil
router.post("/razorpay/verify", verifyRazorpayPayment);

// Fetch order details for the success page (excludes download links)
router.get("/:id", getOrder);

// ── Stripe (COMMENTED OUT — uncomment when STRIPE_SECRET_KEY is ready) ────
// const { createStripeIntent, stripeWebhook } = require("../controllers/orderController");
// router.post("/stripe/intent", createStripeIntent);
// Note: stripeWebhook is mounted directly in server.js (needs raw body, not JSON)

module.exports = router;