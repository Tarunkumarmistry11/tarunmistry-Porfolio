const Order = require("../models/Order");
const Product = require("../models/Product");
const {
  createPaymentIntent,
  constructWebhookEvent,
} = require("../services/stripeService");
const { createOrder, verifySignature } = require("../services/razorpayService");
const { sendPurchaseEmail } = require("../services/emailService");
const { getSignedDownloadUrl } = require("../services/supabaseService");

// ── Shared: fulfil a paid order ───────────────────────────
// IMPLEMENT: called by both Stripe webhook and Razorpay verify
// 1. Mark order as paid
// 2. Generate signed download URLs per product
// 3. Send email with links
// 4. Mark emailSent = true
const fulfilOrder = async (orderId, paymentId) => {
  const order = await Order.findById(orderId).populate("items.product");
  if (!order || order.paymentStatus === "paid") return;

  order.paymentStatus = "paid";
  order.paymentId = paymentId;

  const downloadLinks = [];
  for (const item of order.items) {
    for (const filePath of item.product.downloadFiles) {
      const url = await getSignedDownloadUrl(filePath);
      downloadLinks.push({ productName: item.product.name, url });
    }
  }

  order.downloadLinks = downloadLinks.map((l) => l.url);
  await order.save();

  if (!order.emailSent) {
    await sendPurchaseEmail({
      to: order.email,
      name: order.name,
      items: order.items,
      downloadLinks,
      orderId: order._id.toString().slice(-8).toUpperCase(),
    });
    order.emailSent = true;
    await order.save();
  }
};

// ── Stripe: create PaymentIntent ──────────────────────────
// IMPLEMENT: receive { items, currency, email, name, country }
// Returns { clientSecret, orderId } to frontend
const createStripeIntent = async (req, res, next) => {
  try {
    const { items, currency, email, name, country } = req.body;
    const products = await Product.find({
      _id: { $in: items.map((i) => i.productId) },
    });

    const subtotal = products.reduce((sum, p) => {
      const qty =
        items.find((i) => i.productId === p._id.toString())?.quantity || 1;
      return sum + (p.price[country] || p.price.US) * qty;
    }, 0);

    const intent = await createPaymentIntent({
      amount: subtotal,
      currency,
      metadata: { email, name },
    });

    const order = await Order.create({
      email,
      name,
      currency,
      country,
      paymentMethod: "stripe",
      paymentId: intent.id,
      paymentStatus: "pending",
      subtotal,
      items: products.map((p) => ({
        product: p._id,
        name: p.name,
        quantity:
          items.find((i) => i.productId === p._id.toString())?.quantity || 1,
        price: p.price[country] || p.price.US,
        currency,
      })),
    });

    res.json({ clientSecret: intent.client_secret, orderId: order._id });
  } catch (err) {
    next(err);
  }
};

// ── Razorpay: create order ────────────────────────────────
// IMPLEMENT: receive { items, email, name }
// Returns { orderId, razorpayOrderId, amount, keyId } to frontend
const createRazorpayOrder = async (req, res, next) => {
  try {
    const { items, email, name } = req.body;
    const products = await Product.find({
      _id: { $in: items.map((i) => i.productId) },
    });

    const subtotal = products.reduce((sum, p) => {
      const qty =
        items.find((i) => i.productId === p._id.toString())?.quantity || 1;
      return sum + p.price.IN * qty;
    }, 0);

    const rzOrder = await createOrder({
      amount: subtotal,
      receipt: `rcpt_${Date.now()}`,
    });

    const order = await Order.create({
      email,
      name,
      currency: "INR",
      country: "IN",
      paymentMethod: "razorpay",
      paymentId: rzOrder.id,
      paymentStatus: "pending",
      subtotal,
      items: products.map((p) => ({
        product: p._id,
        name: p.name,
        quantity:
          items.find((i) => i.productId === p._id.toString())?.quantity || 1,
        price: p.price.IN,
        currency: "INR",
      })),
    });

    res.json({
      orderId: order._id,
      razorpayOrderId: rzOrder.id,
      amount: rzOrder.amount,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    next(err);
  }
};

// ── Razorpay: verify payment + fulfil ────────────────────
const verifyRazorpay = async (req, res, next) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      req.body;
    if (
      !verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)
    ) {
      return res.status(400).json({ message: "Invalid signature" });
    }
    await fulfilOrder(orderId, razorpayPaymentId);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

// ── Stripe: webhook handler ───────────────────────────────
// IMPLEMENT: raw body required — mounted BEFORE express.json() in server.js
const stripeWebhook = async (req, res) => {
  try {
    const event = constructWebhookEvent(
      req.body,
      req.headers["stripe-signature"],
    );
    if (event.type === "payment_intent.succeeded") {
      const intent = event.data.object;
      const order = await Order.findOne({ paymentId: intent.id });
      if (order) await fulfilOrder(order._id.toString(), intent.id);
    }
    res.json({ received: true });
  } catch (err) {
    res.status(400).send(`Webhook error: ${err.message}`);
  }
};

module.exports = {
  createStripeIntent,
  createRazorpayOrder,
  verifyRazorpay,
  stripeWebhook,
};
