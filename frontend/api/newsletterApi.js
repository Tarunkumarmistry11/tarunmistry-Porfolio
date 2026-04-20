const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Subscribe an email address to the newsletter.
 * Sends POST /api/newsletter/subscribe
 * Backend handles Mailchimp or MongoDB fallback.
 */
export const subscribeEmail = async (email) => {
  const res = await fetch(`${BASE}/newsletter/subscribe`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ email }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Subscription failed");
  }

  return data; // { success: true, message: "Subscribed successfully" }
};