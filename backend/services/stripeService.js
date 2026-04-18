const Stripe = require("stripe");

// IMPLEMENT: init with secret key from .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Create a PaymentIntent for Stripe card payments.
 * amount is in the smallest currency unit (paise for INR, cents for USD).
 */
const createPaymentIntent = async ({ amount, currency, metadata }) =>
  stripe.paymentIntents.create({
    amount:   Math.round(amount * 100),
    currency: currency.toLowerCase(),
    metadata,
    automatic_payment_methods: { enabled: true },
  });

/**
 * Verify incoming webhook events from Stripe.
 * raw body (Buffer) is required — do NOT parse with express.json() before this.
 */
const constructWebhookEvent = (rawBody, sig) =>
  stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);

module.exports = { createPaymentIntent, constructWebhookEvent };