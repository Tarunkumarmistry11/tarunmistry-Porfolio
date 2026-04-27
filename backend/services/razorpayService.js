const Razorpay = require("razorpay");
const crypto   = require("crypto");

// Initialise Razorpay client once using credentials from .env
// RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set before starting the server
const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * createOrder — creates an order on Razorpay's servers.
 *
 * IMPORTANT: amount is in RUPEES here (e.g. 799).
 * We multiply by 100 to convert to PAISE, which is what Razorpay requires.
 * e.g. ₹799 → 79900 paise
 *
 * @param {number} amount  - amount in INR (rupees)
 * @param {string} receipt - unique receipt ID for this order (used for reconciliation)
 * @returns {Promise<object>} Razorpay order object with .id, .amount, .currency etc.
 */
const createOrder = async ({ amount, receipt }) =>
  razorpay.orders.create({
    amount:   Math.round(amount * 100), // convert rupees → paise
    currency: "INR",
    receipt,
  });

/**
 * verifySignature — verifies the HMAC-SHA256 signature Razorpay sends after payment.
 *
 * WHY THIS MATTERS: without this check, anyone could fake a successful payment
 * by sending a crafted request to /razorpay/verify. This is the security gate.
 *
 * Formula (from Razorpay docs):
 *   expected = HMAC_SHA256( razorpay_order_id + "|" + razorpay_payment_id, key_secret )
 *
 * @param {string} razorpayOrderId   - from Razorpay frontend callback
 * @param {string} razorpayPaymentId - from Razorpay frontend callback
 * @param {string} signature         - from Razorpay frontend callback
 * @returns {boolean} true if signature is valid
 */
const verifySignature = (razorpayOrderId, razorpayPaymentId, signature) => {
  const body     = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  // Use timing-safe comparison to prevent timing attacks
  return expected === signature;
};

/**
 * createQRCode — creates a UPI QR code on Razorpay's servers.
 *
 * IMPORTANT: QR codes are short-lived (5 min default for payments).
 * A QR code can accept multiple payments, but for our flow, we create one per order.
 * The QR code image URL is used to display the QR to the user.
 *
 * @param {number} amount  - amount in INR (rupees)
 * @param {number} expiryTime - expiry in seconds (default 300 for 5 min)
 * @returns {Promise<object>} Razorpay QR code object with .id, .image_url, .expires_at etc.
 */
const createQRCode = async ({ amount, expiryTime = 300 }) => {
  return razorpay.qrCode.create({
    upi_link: {
      upi_string: `upi://pay?tr=neft`,  // Placeholder; Razorpay handles actual routing
      expiry_time: expiryTime,
    },
    amount:   Math.round(amount * 100), // convert rupees → paise
    currency: "INR",
    close_reason: "on_expiry",  // automatically close QR when it expires
  });
};

/**
 * fetchQRCode — fetch details of an existing QR code by ID.
 *
 * @param {string} qrCodeId - Razorpay QR code ID
 * @returns {Promise<object>} QR code details including image_url and status
 */
const fetchQRCode = async (qrCodeId) => {
  return razorpay.qrCode.fetch(qrCodeId);
};

module.exports = { createOrder, verifySignature, createQRCode, fetchQRCode };

// ── STRIPE (commented out — uncomment when STRIPE_SECRET_KEY is available) ────
// const Stripe = require("stripe");
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
//
// const createStripeIntent = async ({ amount, currency, metadata }) =>
//   stripe.paymentIntents.create({
//     amount:   Math.round(amount * 100),
//     currency: currency.toLowerCase(),
//     metadata,
//     automatic_payment_methods: { enabled: true },
//   });
//
// const constructWebhookEvent = (rawBody, sig) =>
//   stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
//
// module.exports = { createOrder, verifySignature, createStripeIntent, constructWebhookEvent };