const nodemailer = require("nodemailer");

// Create the SMTP transport once at module load.
// For dev: use Gmail with an App Password (not your real Gmail password).
//   → Google Account → Security → 2-Step Verification → App passwords → create one
// For prod: switch SMTP_HOST to SendGrid/Resend for better deliverability.
const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for port 465, false for 587 (STARTTLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // Gmail App Password, not your login password
  },
});

/**
 * sendPurchaseEmail — sends the post-purchase email with Supabase download links.
 *
 * Called by fulfilOrder() in orderController.js after payment is verified.
 * The emailSent flag on the Order prevents duplicate sends even if called twice.
 *
 * @param {string}   to            - buyer's email address
 * @param {string}   name          - buyer's name (shown in greeting)
 * @param {Array}    items         - cart items [{ name, quantity }] (for display only)
 * @param {Array}    downloadLinks - [{ productName: string, url: string }]
 * @param {string}   orderId       - last 8 chars of MongoDB _id, shown in email header
 */
const sendPurchaseEmail = async ({ to, name, items, downloadLinks, orderId }) => {
  // Build one download block per product
  const linksHTML = downloadLinks
    .map(({ productName, url }) => `
      <div style="margin-bottom:20px;padding:20px;border:1px solid #222;border-radius:6px;">
        <p style="font-family:Georgia,serif;font-size:16px;color:#f0ebe4;margin:0 0 12px;">
          ${productName}
        </p>
        <a href="${url}"
           style="display:inline-block;padding:12px 28px;background:#f0ebe4;
                  color:#0f0f0f;font-family:monospace;font-size:11px;
                  letter-spacing:0.1em;text-decoration:none;text-transform:uppercase;">
          Download →
        </a>
        <p style="font-family:monospace;font-size:10px;color:#555;margin-top:10px;">
          Link expires in 48 hours · do not share
        </p>
      </div>`)
    .join("");

  // Dark-themed HTML email template
  const html = `
    <!DOCTYPE html>
    <html>
    <body style="background:#0f0f0f;color:#f0ebe4;font-family:Georgia,serif;margin:0;padding:0;">
      <div style="max-width:580px;margin:0 auto;padding:48px 28px;">

        <p style="font-family:monospace;font-size:10px;letter-spacing:0.16em;
                  text-transform:uppercase;color:#444;margin-bottom:40px;">
          Order #${orderId}
        </p>

        <h1 style="font-size:34px;font-weight:400;letter-spacing:-0.02em;margin:0 0 6px;">
          Your files<br>are ready.
        </h1>

        <p style="color:#888;font-size:15px;line-height:1.8;margin:20px 0 36px;">
          Hi ${name},<br>
          Thank you for your purchase. Your cinematic tools are waiting below.
        </p>

        <hr style="border:none;border-top:1px solid #1e1e1e;margin:0 0 28px;">

        <p style="font-family:monospace;font-size:10px;letter-spacing:0.14em;
                  text-transform:uppercase;color:#555;margin-bottom:20px;">
          Your downloads
        </p>

        ${linksHTML}

        <hr style="border:none;border-top:1px solid #1e1e1e;margin:32px 0;">

        <p style="color:#888;font-size:15px;line-height:1.8;">
          Apply these to your work and let the light do what it does best.<br>
          Any questions? Reply directly to this email.
        </p>

        <p style="margin-top:36px;font-style:italic;font-size:15px;color:#f0ebe4;">
          Keep creating things worth seeing.
        </p>
        <p style="color:#555;font-size:13px;margin-top:4px;">— Tarun</p>

        <hr style="border:none;border-top:1px solid #1e1e1e;margin:32px 0;">
        <p style="font-family:monospace;font-size:10px;color:#333;letter-spacing:0.08em;">
          SECURE DELIVERY · LINKS EXPIRE IN 48 HOURS · DO NOT SHARE
        </p>
      </div>
    </body>
    </html>`;

  await transporter.sendMail({
    from:    `"Tarun Mistry" <${process.env.SMTP_USER}>`,
    to,
    subject: "Your Cinematic Pack is Ready 🎬",
    html,
  });
};

module.exports = { sendPurchaseEmail };