const axios = require("axios");
const crypto = require("crypto");

/**
 * POST /api/newsletter/subscribe
 * body: { email }
 *
 * Adds email to Mailchimp list.
 * If Mailchimp env vars are not set, saves to MongoDB as fallback.
 */
const subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400);
      throw new Error("Valid email is required");
    }

    const apiKey   = process.env.MAILCHIMP_API_KEY;
    const listId   = process.env.MAILCHIMP_LIST_ID;
    const dc       = apiKey?.split("-")[1]; // datacenter e.g. "us21"

    if (apiKey && listId && dc) {
      // ── Mailchimp integration ──────────────────────
      const subscriberHash = crypto
        .createHash("md5")
        .update(email.toLowerCase())
        .digest("hex");

      try {
        await axios.put(
          `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members/${subscriberHash}`,
          {
            email_address: email.toLowerCase(),
            status_if_new: "subscribed",
            status:        "subscribed",
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
          }
        );
        return res.json({ success: true, message: "Subscribed successfully" });
      } catch (mailchimpErr) {
        const detail = mailchimpErr.response?.data?.detail || "Mailchimp error";
        // Already subscribed is not an error
        if (mailchimpErr.response?.data?.title === "Member Exists") {
          return res.json({ success: true, message: "Already subscribed" });
        }
        throw new Error(detail);
      }
    }

    // ── Fallback: save to MongoDB if no Mailchimp keys ─
    const Subscriber = require("../models/Subscriber");
    const existing   = await Subscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.json({ success: true, message: "Already subscribed" });
    }
    await Subscriber.create({ email: email.toLowerCase() });
    return res.json({ success: true, message: "Subscribed successfully" });

  } catch (err) { next(err); }
};

module.exports = { subscribe };