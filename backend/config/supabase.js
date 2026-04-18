const { createClient } = require("@supabase/supabase-js");

// IMPLEMENT: initialise once, export for use in supabaseService.js
// Requires SUPABASE_URL and SUPABASE_SERVICE_KEY in .env
// Use the SERVICE key (not anon key) so backend can generate signed URLs
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = supabase;