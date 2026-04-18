const express = require("express");
const router = express.Router();

// Temporarily disabled payment controllers
// const {
//   createStripeIntent,
//   createRazorpayOrder,
//   verifyRazorpay,
// } = require("../controllers/orderController");

// router.post("/stripe/intent", createStripeIntent);
// router.post("/razorpay/create", createRazorpayOrder);
// router.post("/razorpay/verify", verifyRazorpay);

router.get("/test", (req, res) => {
  res.json({ message: "Orders route is working. Payment setup coming soon." });
});

module.exports = router;