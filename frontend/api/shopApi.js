// const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// export const fetchProducts = async (category) => {
//   const qs  = category && category !== "all" ? `?category=${category}` : "";
//   const res = await fetch(`${BASE}/shop${qs}`);
//   if (!res.ok) throw new Error("Failed to fetch products");
//   return res.json();
// };

// export const createStripeIntent = async (payload) => {
//   const res = await fetch(`${BASE}/orders/stripe/intent`, {
//     method:  "POST",
//     headers: { "Content-Type": "application/json" },
//     body:    JSON.stringify(payload),
//   });
//   if (!res.ok) throw new Error("Payment intent failed");
//   return res.json();
// };

// export const createRazorpayOrder = async (payload) => {
//   const res = await fetch(`${BASE}/orders/razorpay/create`, {
//     method:  "POST",
//     headers: { "Content-Type": "application/json" },
//     body:    JSON.stringify(payload),
//   });
//   if (!res.ok) throw new Error("Razorpay order failed");
//   return res.json();
// };

// export const verifyRazorpay = async (payload) => {
//   const res = await fetch(`${BASE}/orders/razorpay/verify`, {
//     method:  "POST",
//     headers: { "Content-Type": "application/json" },
//     body:    JSON.stringify(payload),
//   });
//   if (!res.ok) throw new Error("Verification failed");
//   return res.json();
// };

// export const submitReview = async (slug, review) => {
//   const res = await fetch(`${BASE}/shop/${slug}/reviews`, {
//     method:  "POST",
//     headers: { "Content-Type": "application/json" },
//     body:    JSON.stringify(review),
//   });
//   if (!res.ok) throw new Error("Review submission failed");
//   return res.json();
// };

// src/api/shopApi.js

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const fetchProducts = async (category) => {
  const qs  = category && category !== "all" ? `?category=${category}` : "";
  const res = await fetch(`${BASE}/shop${qs}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

export const fetchProductBySlug = async (slug) => {
  const res = await fetch(`${BASE}/shop/${slug}`);
  if (!res.ok) throw new Error("Product not found");
  return res.json();
};

export const submitReview = async (slug, review) => {
  const res = await fetch(`${BASE}/shop/${slug}/reviews`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(review),
  });
  if (!res.ok) throw new Error("Review submission failed");
  return res.json();
};

// ── Payment functions — implemented later ─────────────────
export const createStripeIntent  = async () => { throw new Error("Not implemented yet"); };
export const createRazorpayOrder = async () => { throw new Error("Not implemented yet"); };
export const verifyRazorpay      = async () => { throw new Error("Not implemented yet"); };