const supabase = require("../config/supabase");

const BUCKET = process.env.SUPABASE_BUCKET || "digital-products";

/**
 * IMPLEMENT: Generate a signed (expiring) download URL.
 *
 * @param {string} filePath  - path inside the bucket e.g. "presets/moody-pack.zip"
 * @param {number} expiresIn - seconds until expiry (default 48 hours)
 * @returns {Promise<string>} signed URL
 *
 * HOW IT WORKS:
 * 1. Files are uploaded to Supabase Storage (private bucket — no public access)
 * 2. After payment, this function generates a URL valid for expiresIn seconds
 * 3. The URL is included in the purchase email — user downloads within window
 * 4. After expiry the link is dead — prevents indefinite sharing
 */
const getSignedDownloadUrl = async (filePath, expiresIn = 48 * 60 * 60) => {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(filePath, expiresIn);

  if (error) throw new Error(`Supabase signed URL error: ${error.message}`);
  return data.signedUrl;
};

module.exports = { getSignedDownloadUrl };