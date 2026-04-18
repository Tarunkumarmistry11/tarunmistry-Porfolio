const nodemailer = require("nodemailer");

// IMPLEMENT: configure transport
// For dev: use Gmail App Password (SMTP_HOST=smtp.gmail.com, SMTP_PORT=587)
// For prod: switch to SendGrid or Resend for better deliverability
const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * IMPLEMENT: Send post-purchase email with expiring download links.
 *
 * @param {object} params
 * @param {string}   params.to             - buyer email
 * @param {string}   params.name           - buyer name
 * @param {Array}    params.items          - [{ name, category, quantity }]
 * @param {Array}    params.downloadLinks  - [{ productName, url }]
 * @param {string}   params.orderId        - short order reference
 *
 * EMAIL STRUCTURE:
 * - Subject: "Your Cinematic Pack is Ready 🎬"
 * - Dark-themed HTML template
 * - One download button per product
 * - 48-hour expiry warning
 * - Personal thank-you note (your brand voice)
 */
const sendPurchaseEmail = async ({ to, name, items, downloadLinks, orderId }) => {
  const linksHTML = downloadLinks
    .map(
      ({ productName, url }) => `
        <div style="margin-bottom:20px;padding:20px;border:1px solid #222;border-radius:6px;">
          <p style="font-family:serif;font-size:17px;color:#f0ebe4;margin:0 0 12px;">
            ${productName}
          </p>
          <a href="${url}"
             style="display:inline-block;padding:11px 26px;background:#f0ebe4;
                    color:#0f0f0f;font-family:monospace;font-size:11px;
                    letter-spacing:0.1em;text-decoration:none;text-transform:uppercase;">
            Download →
          </a>
          <p style="font-family:monospace;font-size:10px;color:#555;margin-top:10px;">
            Link expires in 48 hours
          </p>
        </div>`
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="background:#0f0f0f;color:#f0ebe4;font-family:Georgia,serif;margin:0;padding:0;">
      <div style="max-width:580px;margin:0 auto;padding:48px 28px;">

        <p style="font-family:monospace;font-size:10px;letter-spacing:0.16em;
                  text-transform:uppercase;color:#555;margin-bottom:40px;">
          Order #${orderId}
        </p>

        <h1 style="font-size:34px;font-weight:400;letter-spacing:-0.02em;margin:0 0 6px;">
          Your files<br>are ready.
        </h1>

        <p style="color:#888;font-size:15px;line-height:1.8;margin:20px 0 36px;">
          Hi ${name}, thank you for your purchase.<br>
          Your cinematic tools are waiting below.
        </p>

        <hr style="border:none;border-top:1px solid #1e1e1e;margin:0 0 28px;">

        <p style="font-family:monospace;font-size:10px;letter-spacing:0.14em;
                  text-transform:uppercase;color:#555;margin-bottom:20px;">
          Your downloads
        </p>

        ${linksHTML}

        <hr style="border:none;border-top:1px solid #1e1e1e;margin:32px 0;">

        <p style="color:#888;font-size:15px;line-height:1.8;">
          Apply these to your images and let the light do what it does best.
          If anything feels off, reply directly to this email.
        </p>

        <p style="margin-top:36px;font-style:italic;font-size:15px;color:#f0ebe4;">
          Keep creating things worth seeing.
        </p>
        <p style="color:#555;font-size:13px;">— Tarun</p>

        <hr style="border:none;border-top:1px solid #1e1e1e;margin:32px 0;">
        <p style="font-family:monospace;font-size:10px;color:#333;letter-spacing:0.08em;">
          LINKS EXPIRE IN 48 HOURS · DO NOT SHARE
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