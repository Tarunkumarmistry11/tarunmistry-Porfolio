const Razorpay = require("razorpay");
const crypto   = require("crypto");

// IMPLEMENT: init with key_id and key_secret from .env
const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/** Create a Razorpay order (INR only) */
const createOrder = ({ amount, receipt }) =>
  razorpay.orders.create({ amount: Math.round(amount * 100), currency: "INR", receipt });

/** Verify Razorpay payment signature after frontend confirms payment */
const verifySignature = (orderId, paymentId, signature) => {
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return expected === signature;
};

module.exports = { createOrder, verifySignature };