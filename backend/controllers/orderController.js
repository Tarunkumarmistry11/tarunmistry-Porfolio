const Order    = require("../models/Order");
const Product  = require("../models/Product");
const Razorpay  = require("razorpay");

// Active payment service — Razorpay only
const { createOrder: createRzOrder, verifySignature } =
  require("../services/razorpayService");

const { sendPurchaseEmail }    = require("../services/emailService");
const { getSignedDownloadUrl } = require("../services/supabaseService");

// ── STRIPE (commented out — uncomment when STRIPE_SECRET_KEY is ready) ─────
// const { createPaymentIntent, constructWebhookEvent } =
//   require("../services/razorpayService"); // these will be exported from there


// ════════════════════════════════════════════════════════════════════════════
// SHARED FULFILMENT — called after ANY successful payment (Razorpay or Stripe)
//
// Design decisions:
//  - Idempotent: checks paymentStatus === "paid" before doing anything.
//    Safe to call twice (e.g. webhook + direct verify race condition).
//  - Generates Supabase signed URLs per file per product in the order.
//  - Sends email only once (emailSent flag prevents duplicates).
//  - If a product has no downloadFiles (e.g. physical print), it is skipped.
// ════════════════════════════════════════════════════════════════════════════

// Needed here (separate from razorpayService) to call the QR Code API directly
const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// QR expiry window — 5 minutes in milliseconds
const QR_EXPIRY_MS = 5 * 60 * 1000;



const fulfilOrder = async (orderId, paymentId) => {
  // Load the order with product details populated
  const order = await Order.findById(orderId).populate("items.product");

  if (!order) throw new Error(`Order ${orderId} not found`);

  // IDEMPOTENCY GUARD — if already paid, do nothing and return silently.
  // This handles the race between webhook and direct /verify calls.
  if (order.paymentStatus === "paid") {
    console.log(`[fulfilOrder] Order ${orderId} already fulfilled — skipping`);
    return;
  }

  // Mark as paid immediately so concurrent calls see it
  order.paymentStatus = "paid";
  order.paymentId     = paymentId;

  // Generate one signed download URL per file per product
  const downloadLinks = [];
  for (const item of order.items) {
    const product = item.product;

    // Skip items where the product document wasn't populated (shouldn't happen)
    if (!product) {
      console.warn(`[fulfilOrder] item.product not populated for order ${orderId}`);
      continue;
    }

    // Skip products with no downloadFiles (e.g. physical prints)
    if (!product.downloadFiles?.length) continue;

    for (const filePath of product.downloadFiles) {
      // getSignedDownloadUrl generates a 48-hour expiring Supabase URL
      const url = await getSignedDownloadUrl(filePath);
      downloadLinks.push({ productName: product.name, url });
    }
  }

  // Store the raw URLs on the order for reference (never exposed via API)
  order.downloadLinks = downloadLinks.map((l) => l.url);
  await order.save();

  // Send the purchase email — only if not already sent
  if (!order.emailSent) {
    await sendPurchaseEmail({
      to:            order.email,
      name:          order.name,
      items:         order.items,
      downloadLinks, // array of { productName, url }
      orderId:       order._id.toString().slice(-8).toUpperCase(), // e.g. "A3F9B2C1"
    });

    order.emailSent = true;
    await order.save();

    console.log(`[fulfilOrder] Email sent to ${order.email} for order ${orderId}`);
  }
};


// ════════════════════════════════════════════════════════════════════════════
// POST /api/orders/razorpay/create
//
// Step 1 of the Razorpay payment flow.
// Frontend sends: { items: [{productId, quantity}], email, name }
//
// What we do here:
//  1. Fetch products from DB (NEVER trust frontend prices)
//  2. Calculate total in INR from DB prices
//  3. Create a Razorpay order (returns a razorpayOrderId)
//  4. Save a pending Order to MongoDB
//  5. Return { orderId, razorpayOrderId, amount (paise), keyId } to frontend
//
// The frontend then opens the Razorpay modal with these details.
// ════════════════════════════════════════════════════════════════════════════
const createRazorpayOrder = async (req, res, next) => {
  try {
    const { items, email, name } = req.body;

    // Validate required fields
    if (!items?.length || !email?.trim() || !name?.trim()) {
      res.status(400);
      throw new Error("items, email, and name are all required");
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      res.status(400);
      throw new Error("Invalid email address");
    }

    // Fetch products from DB using the IDs sent by the frontend
    const productIds = items.map((i) => i.productId);
    const products   = await Product.find({ _id: { $in: productIds }, active: true });

    if (!products.length) {
      res.status(400);
      throw new Error("No valid active products found for the given IDs");
    }

    // Calculate total in INR — using DB prices, never frontend prices
    const subtotal = products.reduce((sum, p) => {
      const cartItem = items.find((i) => i.productId === p._id.toString());
      const qty      = cartItem?.quantity || 1;
      // p.price.IN is the INR price set in the Product model
      return sum + (p.price?.IN || 0) * qty;
    }, 0);

    if (subtotal <= 0) {
      res.status(400);
      throw new Error("Order total must be greater than zero");
    }

    // Create Razorpay order on their servers
    // This gives us a razorpayOrderId that the frontend modal needs
    const rzOrder = await createRzOrder({
      amount:  subtotal,                    // in rupees — service converts to paise
      receipt: `rcpt_${Date.now()}`,        // unique receipt for your records
    });

    // Save a PENDING order to MongoDB
    // Status will be updated to "paid" by verifyRazorpayPayment after user pays
    const order = await Order.create({
      email:         email.trim().toLowerCase(),
      name:          name.trim(),
      currency:      "INR",
      country:       "IN",
      paymentMethod: "razorpay",
      paymentId:     rzOrder.id,    // Razorpay order ID stored as paymentId
      paymentStatus: "pending",
      subtotal,
      items: products.map((p) => {
        const cartItem = items.find((i) => i.productId === p._id.toString());
        return {
          product:  p._id,
          name:     p.name,
          quantity: cartItem?.quantity || 1,
          price:    p.price?.IN || 0,
          currency: "INR",
        };
      }),
    });

    // Return everything the frontend needs to open the Razorpay modal
    res.json({
      orderId:         order._id,         // our MongoDB order ID — sent back to verify
      razorpayOrderId: rzOrder.id,         // Razorpay's order ID — used in modal options
      amount:          rzOrder.amount,     // in paise — Razorpay modal uses this directly
      currency:        "INR",
      keyId:           process.env.RAZORPAY_KEY_ID, // public key — safe to send to frontend
    });

  } catch (err) { next(err); }
};


// ════════════════════════════════════════════════════════════════════════════
// POST /api/orders/razorpay/verify
//
// Step 2 of the Razorpay payment flow — called after user pays in the modal.
// Frontend sends: { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature }
//
// What we do:
//  1. Verify the HMAC-SHA256 signature (cryptographic proof of genuine payment)
//  2. If valid → call fulfilOrder (mark paid, generate URLs, send email)
//  3. If invalid → mark order as failed, return 400
//
// SECURITY: Never skip signature verification. It's the only thing preventing
// someone from faking a payment by calling this endpoint directly.
// ════════════════════════════════════════════════════════════════════════════
const verifyRazorpayPayment = async (req, res, next) => {
  try {
    const {
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;

    // Validate all four fields are present
    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      res.status(400);
      throw new Error(
        "orderId, razorpayOrderId, razorpayPaymentId, and razorpaySignature are all required"
      );
    }

    // SIGNATURE VERIFICATION — the security gate
    // If this fails, the payment is either fake or tampered with
    const isValid = verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

    if (!isValid) {
      // Mark the order as failed in DB so we have an audit trail
      await Order.findByIdAndUpdate(orderId, { paymentStatus: "failed" });

      console.warn(
        `[verifyRazorpayPayment] Invalid signature for order ${orderId}. ` +
        `Possible tampering attempt.`
      );

      res.status(400);
      throw new Error("Invalid payment signature — payment could not be verified");
    }

    // Signature is valid — fulfil the order
    // fulfilOrder is idempotent — safe to call even if webhook already ran
    await fulfilOrder(orderId, razorpayPaymentId);

    res.json({
      success: true,
      message: "Payment verified. Your files have been sent to your email.",
    });

  } catch (err) { next(err); }
};


// ════════════════════════════════════════════════════════════════════════════
// GET /api/orders/:id — fetch order for the success page
//
// Used by OrderSuccess.jsx to show order details.
// downloadLinks are intentionally excluded — they were already emailed.
// ════════════════════════════════════════════════════════════════════════════
const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .select("-downloadLinks")  // never expose signed URLs through the API
      .populate("items.product", "name category coverImage");

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    res.json(order);
  } catch (err) { next(err); }
};

const getQRCode = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    // Already paid — tell frontend to skip QR and go to success
    if (order.paymentStatus === "paid") {
      return res.json({
        alreadyPaid: true,
        email:       order.email,
        orderId:     order._id,
      });
    }

    // If the QR has expired or order explicitly failed, create a fresh Razorpay order
    // so we get a new QR that isn't tied to the old closed order
    const isExpired = order.expiryTime && new Date() > new Date(order.expiryTime);
    if (order.paymentStatus === "expired" || (isExpired && order.paymentStatus !== "paid")) {
      const rzOrder = await createRzOrder({
        amount:  order.subtotal,
        receipt: `rcpt_retry_${Date.now()}`,
      });
      order.paymentStatus = "pending";
      order.paymentId     = rzOrder.id;
      order.expiryTime    = null;
      await order.save();
    }

    // Set 5-minute expiry from now
    const expiryTime = new Date(Date.now() + QR_EXPIRY_MS);
    order.expiryTime = expiryTime;
    await order.save();

    // closeBy must be a Unix timestamp in seconds — Razorpay closes QR at this time
    const closeByTimestamp = Math.floor(expiryTime.getTime() / 1000);

    let qrData;
    try {
      // Razorpay QR Code API — requires live/test key with QR feature enabled
      qrData = await razorpay.qrCode.create({
        type:           "upi_qr",
        name:           "Tarun Mistry",
        usage:          "single_use",   // QR invalidated after one scan
        fixed_amount:   true,
        payment_amount: order.subtotal * 100, // paise
        description:    `Order ${order._id.toString().slice(-8).toUpperCase()}`,
        close_by:       closeByTimestamp,
        notes: {
          order_db_id: order._id.toString(), // used by webhook to find this order
          email:       order.email,
        },
      });
    } catch (qrErr) {
      // QR API not available on all test keys — send null image URL
      // Frontend shows a "QR not available in test mode" placeholder
      console.warn("[getQRCode] Razorpay QR API error:", qrErr.message);
      qrData = { id: `qr_fallback_${Date.now()}`, image_url: null };
    }

    res.json({
      qrId:       qrData.id,
      qrImageUrl: qrData.image_url,  // null in test mode — frontend handles this
      expiryTime: expiryTime.toISOString(),
      orderId:    order._id,
      amount:     order.subtotal,
    });

  } catch (err) { next(err); }
};


// ════════════════════════════════════════════════════════════════════════════
// GET /api/orders/razorpay/status/:orderId
//
// Polling endpoint — called by frontend every 3 seconds while QR is shown.
// READ-ONLY: just checks current DB status. Never fulfils here.
// Fulfilment only happens via webhook or /verify to avoid race conditions.
//
// Returns { status: "pending" | "paid" | "failed" | "expired" }
// ════════════════════════════════════════════════════════════════════════════
const pollPaymentStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    // Only fetch the fields we need — lighter query
    const order = await Order.findById(orderId)
      .select("paymentStatus expiryTime email");

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    // Check if QR window has expired (order still pending but time is up)
    if (
      order.paymentStatus === "pending" &&
      order.expiryTime &&
      new Date() > new Date(order.expiryTime)
    ) {
      // Mark as expired in DB so next poll (and retry) sees the correct state
      order.paymentStatus = "expired";
      await order.save();
      return res.json({ status: "expired" });
    }

    // If paid, include email so frontend can show it on the success page
    if (order.paymentStatus === "paid") {
      return res.json({
        status:  "paid",
        email:   order.email,
        orderId: order._id,
      });
    }

    // pending / failed / expired — just return the status
    res.json({ status: order.paymentStatus });

  } catch (err) { next(err); }
};


// ════════════════════════════════════════════════════════════════════════════
// Razorpay webhook handler — receives events when QR is paid
// Mounted in server.js BEFORE express.json() (needs raw body for HMAC verify)
// ════════════════════════════════════════════════════════════════════════════
const crypto = require("crypto");

const razorpayWebhook = async (req, res) => {
  try {
    const receivedSig = req.headers["x-razorpay-signature"];
    const secret      = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
      // Webhook secret not configured — skip verification in dev
      console.warn("[razorpayWebhook] RAZORPAY_WEBHOOK_SECRET not set — skipping signature check");
    } else {
      const expectedSig = crypto
        .createHmac("sha256", secret)
        .update(req.body) // raw Buffer
        .digest("hex");

      if (receivedSig !== expectedSig) {
        console.warn("[razorpayWebhook] Invalid signature — ignoring event");
        return res.status(400).json({ error: "Invalid signature" });
      }
    }

    // Parse now that signature is verified
    const event = JSON.parse(req.body.toString());
    console.log(`[razorpayWebhook] Received event: ${event.event}`);

    // QR payment credited
    if (event.event === "qr_code.credited") {
      const payment   = event.payload.payment.entity;
      const qrNotes   = event.payload.qr_code?.entity?.notes || {};
      const orderDbId = qrNotes.order_db_id;
      if (orderDbId) {
        await fulfilOrder(orderDbId, payment.id);
        console.log(`[razorpayWebhook] QR payment fulfilled for order ${orderDbId}`);
      }
    }

    // Standard order payment captured (card/netbanking modal)
    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const order   = await Order.findOne({ paymentId: payment.order_id });
      if (order && order.paymentStatus !== "paid") {
        await fulfilOrder(order._id.toString(), payment.id);
        console.log(`[razorpayWebhook] Modal payment fulfilled for order ${order._id}`);
      }
    }

    // Always 200 — Razorpay retries on non-200
    res.json({ received: true });

  } catch (err) {
    console.error("[razorpayWebhook] Error:", err.message);
    res.status(200).json({ received: true, error: err.message });
  }
};


module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getOrder,
  fulfilOrder, // exported so webhook can call it when Stripe is added
  getQRCode,
  pollPaymentStatus,
  razorpayWebhook, // exported to be mounted in server.js
};


// ── STRIPE CONTROLLER FUNCTIONS (commented out — add when STRIPE_SECRET_KEY ready) ──
//
// const createStripeIntent = async (req, res, next) => {
//   try {
//     const { items, currency, email, name, country } = req.body;
//     if (!items?.length || !email || !name) {
//       res.status(400); throw new Error("items, email and name are required");
//     }
//     const products = await Product.find({ _id: { $in: items.map(i => i.productId) } });
//     const subtotal = products.reduce((sum, p) => {
//       const qty = items.find(i => i.productId === p._id.toString())?.quantity || 1;
//       return sum + (p.price[country] ?? p.price.US) * qty;
//     }, 0);
//     const intent = await createPaymentIntent({ amount: subtotal, currency, metadata: { email, name } });
//     const order  = await Order.create({
//       email, name, currency, country,
//       paymentMethod: "stripe",
//       paymentId:     intent.id,
//       paymentStatus: "pending",
//       subtotal,
//       items: products.map(p => ({
//         product:  p._id,
//         name:     p.name,
//         quantity: items.find(i => i.productId === p._id.toString())?.quantity || 1,
//         price:    p.price[country] ?? p.price.US,
//         currency,
//       })),
//     });
//     res.json({ clientSecret: intent.client_secret, orderId: order._id });
//   } catch (err) { next(err); }
// };
//
// const stripeWebhook = async (req, res) => {
//   try {
//     const event = constructWebhookEvent(req.body, req.headers["stripe-signature"]);
//     if (event.type === "payment_intent.succeeded") {
//       const intent = event.data.object;
//       const order  = await Order.findOne({ paymentId: intent.id });
//       if (order) await fulfilOrder(order._id.toString(), intent.id);
//     }
//     res.json({ received: true });
//   } catch (err) {
//     res.status(400).send(`Webhook error: ${err.message}`);
//   }
// };
//
// Add to exports when ready:
// module.exports = { ..., createStripeIntent, stripeWebhook };