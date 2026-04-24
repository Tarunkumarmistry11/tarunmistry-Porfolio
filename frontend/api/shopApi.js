const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ── Products ──────────────────────────────────────────────────────────────

/**
 * fetchProducts — GET /api/shop?category=...&sort=...
 * Used by shopSlice to populate the shop grid.
 */
export const fetchProducts = async (category, sort) => {
  const params = new URLSearchParams();
  if (category && category !== "all") params.set("category", category);
  if (sort && sort !== "relevance")   params.set("sort", sort);
  const qs  = params.toString() ? `?${params.toString()}` : "";
  const res = await fetch(`${BASE}/shop${qs}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

/**
 * fetchProductBySlug — GET /api/shop/:slug
 * Used by shopSlice to load a single product for ProductDetail.
 */
export const fetchProductBySlug = async (slug) => {
  const res = await fetch(`${BASE}/shop/${encodeURIComponent(slug)}`);
  if (!res.ok) throw new Error("Product not found");
  return res.json();
};

/**
 * submitReview — POST /api/shop/:slug/reviews
 * Submits a user review for a product.
 */
export const submitReview = async (slug, review) => {
  const res = await fetch(`${BASE}/shop/${encodeURIComponent(slug)}/reviews`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(review),
  });
  if (!res.ok) throw new Error("Review submission failed");
  return res.json();
};

// ── Razorpay (ACTIVE) ─────────────────────────────────────────────────────

/**
 * createRazorpayOrder — POST /api/orders/razorpay/create
 *
 * Step 1 of the payment flow. Called before opening the Razorpay modal.
 * Backend creates the order, calculates total from DB, returns credentials.
 *
 * @param {{ items: {productId, quantity}[], email: string, name: string }} payload
 * @returns {{ orderId, razorpayOrderId, amount, currency, keyId }}
 */
export const createRazorpayOrder = async (payload) => {
  const res = await fetch(`${BASE}/orders/razorpay/create`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create Razorpay order");
  return data;
};

/**
 * verifyRazorpay — POST /api/orders/razorpay/verify
 *
 * Step 2 of the payment flow. Called inside the Razorpay modal's handler
 * callback after the user successfully pays.
 * Backend verifies HMAC signature, generates download URLs, sends email.
 *
 * @param {{ orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature }} payload
 * @returns {{ success: true, message: string }}
 */
export const verifyRazorpay = async (payload) => {
  const res = await fetch(`${BASE}/orders/razorpay/verify`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Payment verification failed");
  return data;
};

// ── Razorpay: QR / UPI flow ───────────────────────────────────────────────

/**
 * getQRCode — GET /api/orders/razorpay/qr/:orderId
 * Asks backend to generate a Razorpay QR code and set a 5-min expiry.
 * Returns { qrId, qrImageUrl, expiryTime, orderId, amount }
 */
export const getQRCode = async (orderId) => {
  const res = await fetch(`${BASE}/orders/razorpay/qr/${orderId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to generate QR");
  return data;
};

/**
 * pollPaymentStatus — GET /api/orders/razorpay/status/:orderId
 * Checks current payment status. Called every 3 seconds while QR is shown.
 * Returns { status: "pending" | "paid" | "failed" | "expired", email?, orderId? }
 */
export const pollPaymentStatus = async (orderId) => {
  const res = await fetch(`${BASE}/orders/razorpay/status/${orderId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Status check failed");
  return data;
};

/**
 * fetchOrder — GET /api/orders/:id
 * Fetches order details for the OrderSuccess page.
 * Download links are excluded by the backend (already emailed).
 */
export const fetchOrder = async (orderId) => {
  const res = await fetch(`${BASE}/orders/${orderId}`);
  if (!res.ok) throw new Error("Order not found");
  return res.json();
};

// ── Stripe (COMMENTED OUT — uncomment when STRIPE_SECRET_KEY is ready) ────
//
// /**
//  * createStripeIntent — POST /api/orders/stripe/intent
//  * Creates a Stripe PaymentIntent for card payments.
//  * Returns { clientSecret, orderId } needed by Stripe Elements.
//  */
// export const createStripeIntent = async (payload) => {
//   const res = await fetch(`${BASE}/orders/stripe/intent`, {
//     method:  "POST",
//     headers: { "Content-Type": "application/json" },
//     body:    JSON.stringify(payload),
//   });
//   const data = await res.json();
//   if (!res.ok) throw new Error(data.message || "Payment intent failed");
//   return data;
// };