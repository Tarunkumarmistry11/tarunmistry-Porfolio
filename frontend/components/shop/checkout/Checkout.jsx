// 

// src/components/shop/checkout/Checkout.jsx
// PAYMENT IMPLEMENTATION — COMING LATER
// Stripe + Razorpay will be wired here once shop UI is complete

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectCartItems } from "../../../features/cart/cartSlice";

export default function Checkout() {
  const navigate = useNavigate();
  const items    = useSelector(selectCartItems);

  return (
    <div style={{
      background:     "var(--bg)",
      color:          "var(--fg)",
      minHeight:      "100vh",
      display:        "flex",
      flexDirection:  "column",
      alignItems:     "flex-start",
      justifyContent: "flex-end",
      padding:        "0 clamp(20px,5vw,80px) clamp(60px,10vh,100px)",
    }}>
      <div style={{ overflow: "hidden", marginBottom: "8px" }}>
        <h1 style={{
          fontFamily:    "'Playfair Display', serif",
          fontSize:      "clamp(3.5rem,11vw,9rem)",
          fontWeight:    400,
          lineHeight:    0.92,
          letterSpacing: "-0.025em",
          color:         "var(--fg)",
          margin:        0,
        }}>
          Checkout
        </h1>
      </div>

      <p style={{
        fontFamily:   "'Inter', sans-serif",
        fontSize:     "clamp(0.95rem,1.5vw,1.05rem)",
        lineHeight:   1.85,
        color:        "var(--fg60, rgba(26,26,26,0.6))",
        maxWidth:     "480px",
        margin:       "24px 0 36px",
      }}>
        Payment integration is coming soon.<br />
        Your cart has {items.length} item{items.length !== 1 ? "s" : ""} saved and ready.
      </p>

      <button
        onClick={() => navigate("/shop")}
        style={{
          background:    "none",
          border:        "1px solid var(--fg)",
          color:         "var(--fg)",
          fontFamily:    "'Space Mono', monospace",
          fontSize:      "0.62rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          padding:       "13px 24px",
          cursor:        "pointer",
          transition:    "background 0.25s ease, color 0.25s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--fg)";
          e.currentTarget.style.color      = "var(--bg)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color      = "var(--fg)";
        }}
      >
        ← Continue Shopping
      </button>
    </div>
  );
}