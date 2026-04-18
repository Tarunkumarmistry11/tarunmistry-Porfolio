const SUPPORTED = ["IN", "US", "EU", "GB"];
export const SYMBOLS = { IN: "₹", US: "$", EU: "€", GB: "£" };

let _cache = null;

export const getUserCountry = async () => {
  if (_cache) return _cache;
  try {
    const res  = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    _cache = SUPPORTED.includes(data.country_code) ? data.country_code : "US";
  } catch {
    _cache = "US";
  }
  return _cache;
};

export const getPrice    = (p, c) => p?.price?.[c]         ?? p?.price?.US    ?? 0;
export const getOriginal = (p, c) => p?.originalPrice?.[c] ?? p?.originalPrice?.US ?? null;
export const getSymbol   = (c)    => SYMBOLS[c] ?? "$";
export const getDiscount = (p, c) => {
  const price = getPrice(p, c), orig = getOriginal(p, c);
  return orig ? Math.round((1 - price / orig) * 100) : null;
};