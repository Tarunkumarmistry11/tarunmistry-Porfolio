const supabase = require("../config/supabase");

// Bucket name — must match the private bucket you created in Supabase Storage
const BUCKET = process.env.SUPABASE_BUCKET || "digital-products";

/**
 * getSignedDownloadUrl — generates a time-limited signed URL for a private file.
 *
 * HOW IT WORKS:
 * 1. Files live in a PRIVATE Supabase bucket (not publicly accessible).
 *    Anyone trying to access the file directly gets a 403.
 * 2. After a successful payment, we call this function to get a temporary URL.
 * 3. The URL is valid for `expiresIn` seconds (default: 48 hours = 172800s).
 * 4. After expiry, the link is dead — prevents indefinite sharing of paid content.
 * 5. The signed URL is emailed to the buyer — they download within the window.
 *
 * @param {string} filePath  - path inside the bucket, e.g. "presets/moody-pack.zip"
 * @param {number} expiresIn - seconds until URL expires (default: 48 hours)
 * @returns {Promise<string>} the signed URL string
 */
const getSignedDownloadUrl = async (filePath, expiresIn = 48 * 60 * 60) => {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(filePath, expiresIn);

  if (error) throw new Error(`Supabase signed URL error: ${error.message}`);
  return data.signedUrl;
};

module.exports = { getSignedDownloadUrl };