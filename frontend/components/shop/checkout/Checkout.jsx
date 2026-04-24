import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { gsap } from "gsap";
import {
  selectCartItems,
  selectCartTotal,
  clearCart,
  removeItem,
  updateQuantity,  
} from "../../../features/cart/cartSlice";
import { createRazorpayOrder, verifyRazorpay, getQRCode, pollPaymentStatus, } from "../../../api/shopApi";
import { getUserCountry, getSymbol } from "../../../src/utils/currency";

// ── Card brand icons ───────────────────────────────────────
const CardIcons = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
    {[
      // Visa
      <svg key="visa" viewBox="0 0 38 24" width="30" height="19">
        <rect width="38" height="24" rx="3" fill="#1A1F71" />
        <text
          x="4"
          y="17"
          fontFamily="Arial"
          fontWeight="900"
          fontSize="10"
          fill="white"
        >
          VISA
        </text>
      </svg>,
      // Mastercard
      <svg key="mc" viewBox="0 0 38 24" width="30" height="19">
        <rect width="38" height="24" rx="3" fill="#252525" />
        <circle cx="14" cy="12" r="7" fill="#EB001B" />
        <circle cx="24" cy="12" r="7" fill="#F79E1B" />
        <path
          d="M19 6.8C20.8 8.1 22 10 22 12C22 14 20.8 15.9 19 17.2C17.2 15.9 16 14 16 12C16 10 17.2 8.1 19 6.8Z"
          fill="#FF5F00"
        />
      </svg>,
      // RuPay
      <svg key="rupay" viewBox="0 0 38 24" width="30" height="19">
        <rect
          width="38"
          height="24"
          rx="3"
          fill="white"
          stroke="#ddd"
          strokeWidth="0.5"
        />
        <text
          x="3"
          y="15"
          fontFamily="Arial"
          fontWeight="900"
          fontSize="8"
          fill="#1565C0"
        >
          Ru
        </text>
        <text
          x="16"
          y="15"
          fontFamily="Arial"
          fontWeight="900"
          fontSize="8"
          fill="#E53935"
        >
          Pay
        </text>
      </svg>,
    ]}
    <span
      style={{
        fontFamily: "'Space Mono',monospace",
        fontSize: "0.52rem",
        color: "var(--fg40)",
        letterSpacing: "0.05em",
      }}
    >
      +5
    </span>
  </div>
);

// ── Upsell product ─────────────────────────────────────────
const UPSELL = {
  name: "How to Edit Like a Filmmaker",
  priceIN: 599,
  origIN: 999,
  discount: 40,
  image: "https://images.unsplash.com/photo-1536240478700-b869ad10a2eb?w=120",
};

// ── Shared input field ─────────────────────────────────────
function Field({
  placeholder,
  value,
  onChange,
  type = "text",
  maxLength,
  icon,
  required,
  style = {},
}) {
  return (
    <div style={{ position: "relative", ...style }}>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        maxLength={maxLength}
        style={{
          width: "100%",
          background: "transparent",
          border: "1px solid var(--fg20, rgba(26,26,26,0.2))",
          color: "var(--fg)",
          fontFamily: "'Space Mono', monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.04em",
          padding: icon ? "13px 40px 13px 14px" : "13px 14px",
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.2s ease",
          borderRadius: "2px",
        }}
        onFocus={(e) => (e.target.style.borderColor = "var(--fg)")}
        onBlur={(e) =>
          (e.target.style.borderColor = "var(--fg20, rgba(26,26,26,0.2))")
        }
      />
      {icon && (
        <div
          style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--fg40)",
            lineHeight: 0,
            pointerEvents: "none",
          }}
        >
          {icon}
        </div>
      )}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <h2
      style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(1.1rem,2vw,1.4rem)",
        fontWeight: 400,
        color: "var(--fg)",
        margin: "0 0 14px",
        letterSpacing: "-0.01em",
      }}
    >
      {children}
    </h2>
  );
}
// ── NEW: UPIPaymentPanel component ─────────────────────────────────────────
// Handles the full QR lifecycle:
//   idle → loading → active (with 5-min timer + 3s polling) → paid/expired/failed/error
// Each state has its own UI and clear transitions.
// All intervals are cleaned up on unmount to prevent memory leaks.
function UPIPaymentPanel({ orderId, finalTotal, email, onSuccess, onBack }) {
  // State machine for the QR lifecycle
  const [qrState,     setQrState]     = useState("idle");    // idle|loading|active|expired|failed|paid|error
  const [qrImageUrl,  setQrImageUrl]  = useState(null);
  const [timeLeft,    setTimeLeft]    = useState(300);        // 5 minutes in seconds
  const [statusMsg,   setStatusMsg]   = useState("");
  const [isVerifying, setIsVerifying] = useState(false);     // shows spinner overlay on QR

  // Refs — avoid stale closures and prevent memory leaks after unmount
  const timerRef     = useRef(null);   // setInterval for countdown
  const pollRef      = useRef(null);   // setInterval for payment polling
  const isMountedRef = useRef(true);   // false after unmount — guards all setState calls
  const isRetrying   = useRef(false);  // prevents multiple simultaneous QR requests

  // Mark component as unmounted so pending async ops don't setState on dead component
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      clearInterval(timerRef.current);
      clearInterval(pollRef.current);
    };
  }, []);

  // Stop both the timer and the polling interval
  const stopAll = useCallback(() => {
    clearInterval(timerRef.current);
    clearInterval(pollRef.current);
    timerRef.current = null;
    pollRef.current  = null;
  }, []);

  // Called when QR expires (timer hits 0 or backend says expired)
  const handleExpiry = useCallback(() => {
    stopAll();
    if (!isMountedRef.current) return;
    setQrState("expired");
    setStatusMsg("QR code expired. Please generate a new one.");
  }, [stopAll]);

  // Start the 5-minute countdown from an expiry Date object
  const startTimer = useCallback((expiryDate) => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!isMountedRef.current) return;
      const remaining = Math.max(0, Math.floor((expiryDate - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        handleExpiry();
      }
    }, 1000);
  }, [handleExpiry]);

  // Poll /api/orders/razorpay/status/:orderId every 3 seconds
  // Only reads status — fulfilment happens on backend via webhook
  const startPolling = useCallback((currentOrderId) => {
    clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      if (!isMountedRef.current) return;
      try {
        const result = await pollPaymentStatus(currentOrderId);
        if (result.status === "paid") {
          stopAll();
          if (!isMountedRef.current) return;
          setIsVerifying(true);
          setQrState("paid");
          setStatusMsg("Payment confirmed! Preparing your files...");
          // Brief delay so user sees the success state before redirect
          setTimeout(() => {
            if (isMountedRef.current) {
              onSuccess({ email: result.email || email, orderId: result.orderId || currentOrderId });
            }
          }, 1500);
        } else if (result.status === "expired") {
          stopAll();
          if (isMountedRef.current) handleExpiry();
        } else if (result.status === "failed") {
          stopAll();
          if (isMountedRef.current) {
            setQrState("failed");
            setStatusMsg("Payment failed. Please try again.");
          }
        }
        // status === "pending" → keep polling, do nothing
      } catch (err) {
        // Network error during poll — log and continue; timer handles expiry
        console.warn("[UPI polling] Network error:", err.message);
      }
    }, 3000);
  }, [stopAll, handleExpiry, onSuccess, email]);

  // Main function to generate (or regenerate) the QR code
  // Also used for retry after expiry/failure
  const generateQR = useCallback(async () => {
    if (isRetrying.current) return; // prevent double-tap
    isRetrying.current = true;
    stopAll();
    setQrState("loading");
    setQrImageUrl(null);
    setStatusMsg("");
    setTimeLeft(300);
    try {
      const data = await getQRCode(orderId);
      // Edge case: order was already paid (e.g. via another tab)
      if (data.alreadyPaid) {
        setQrState("paid");
        setStatusMsg("Payment already confirmed!");
        setTimeout(() => {
          if (isMountedRef.current) onSuccess({ email: data.email, orderId: data.orderId });
        }, 1200);
        isRetrying.current = false;
        return;
      }
      if (!isMountedRef.current) { isRetrying.current = false; return; }
      const expiryDate = new Date(data.expiryTime);
      setTimeLeft(Math.max(0, Math.floor((expiryDate - Date.now()) / 1000)));
      setQrImageUrl(data.qrImageUrl);
      setQrState("active");
      setStatusMsg("Scan this QR code with any UPI app to pay.");
      startTimer(expiryDate);
      startPolling(orderId);
    } catch (err) {
      if (!isMountedRef.current) { isRetrying.current = false; return; }
      setQrState("error");
      setStatusMsg(err.message || "Failed to generate QR. Please try again.");
    } finally {
      isRetrying.current = false;
    }
  }, [orderId, stopAll, startTimer, startPolling, onSuccess]);

  // Format 265 → "04:25"
  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // Timer colour shifts: green → amber → red as urgency increases
  const timerColor = timeLeft > 120 ? "#4caf50" : timeLeft > 30 ? "#ff9800" : "#e05";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* IDLE — prompt user to generate QR */}
      {qrState === "idle" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: 1.75, color: "var(--fg60)" }}>
            Pay instantly with any UPI app — Google Pay, PhonePe, Paytm, or your bank app.
            A QR code valid for 5 minutes will be generated for you.
          </p>
          <button onClick={generateQR}
            style={{ alignSelf: "flex-start", background: "var(--fg)", border: "none", color: "var(--bg)", fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", padding: "13px 24px", cursor: "pointer", transition: "opacity 0.2s ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Generate QR Code — ₹{finalTotal}
          </button>
        </div>
      )}

      {/* LOADING — spinner while backend creates QR */}
      {qrState === "loading" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", padding: "40px 0" }}>
          <div style={{ width: "48px", height: "48px", border: "2px solid var(--fg10)", borderTop: "2px solid var(--fg)", borderRadius: "50%", animation: "qrSpin 0.8s linear infinite" }} />
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg40)" }}>
            Generating QR code...
          </p>
          <style>{`@keyframes qrSpin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* ACTIVE — QR image + timer + instructions */}
      {qrState === "active" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Timer row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg40)", margin: 0 }}>
              QR expires in
            </p>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "1.1rem", fontWeight: 600, color: timerColor, transition: "color 0.5s ease", letterSpacing: "0.05em" }}>
              {formatTime(timeLeft)}
            </span>
          </div>

          {/* Progress bar — shrinks left to right over 5 minutes */}
          <div style={{ height: "2px", background: "var(--fg10)", borderRadius: "1px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(timeLeft / 300) * 100}%`, background: timerColor, transition: "width 1s linear, background 0.5s ease" }} />
          </div>

          {/* QR image — white background required for scanners */}
          <div style={{ display: "flex", justifyContent: "center", padding: "24px", border: "1px solid var(--fg20)", background: "white", position: "relative" }}>
            {qrImageUrl ? (
              <img src={qrImageUrl} alt="UPI QR Code" style={{ width: "200px", height: "200px", display: "block" }} />
            ) : (
              // Fallback shown in test mode when Razorpay QR API isn't available
              <div style={{ width: "200px", height: "200px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f9f9f9", gap: "12px" }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/>
                  <rect x="19" y="14" width="2" height="2"/><rect x="14" y="19" width="7" height="2"/>
                </svg>
                <p style={{ fontFamily: "monospace", fontSize: "11px", color: "#666", textAlign: "center", margin: 0 }}>
                  QR not available<br />in test mode
                </p>
              </div>
            )}

            {/* Verifying overlay — shown briefly after successful scan */}
            {isVerifying && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.9)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px" }}>
                <div style={{ width: "32px", height: "32px", border: "2px solid #e0e0e0", borderTop: "2px solid #333", borderRadius: "50%", animation: "qrSpin 0.8s linear infinite" }} />
                <p style={{ fontFamily: "monospace", fontSize: "11px", color: "#333" }}>Verifying...</p>
              </div>
            )}
          </div>

          {/* Step-by-step instructions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              "Open any UPI app — Google Pay, PhonePe, Paytm",
              "Tap 'Scan QR' and point your camera at the code",
              `Confirm the payment of ₹${finalTotal}`,
              "This page will update automatically",
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", color: "var(--fg40)", flexShrink: 0, marginTop: "1px" }}>{i + 1}.</span>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.04em", color: "var(--fg60)", margin: 0, lineHeight: 1.6 }}>{step}</p>
              </div>
            ))}
          </div>

          {statusMsg && (
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.06em", color: "var(--fg40)", textAlign: "center" }}>
              {statusMsg}
            </p>
          )}

          <button
            onClick={() => { stopAll(); onBack(); }}
            style={{ background: "none", border: "none", fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg40)", cursor: "pointer", alignSelf: "center", padding: 0, transition: "color 0.2s ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg40)")}
          >
            Cancel and go back
          </button>
        </div>
      )}

      {/* PAID — brief success state before redirect */}
      {qrState === "paid" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "40px 0", textAlign: "center" }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22" stroke="#4caf50" strokeWidth="2"/>
            <path d="M14 24L21 31L34 17" stroke="#4caf50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontStyle: "italic", color: "var(--fg)", margin: 0 }}>Payment confirmed.</p>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.08em", color: "var(--fg40)", margin: 0 }}>{statusMsg}</p>
        </div>
      )}

      {/* EXPIRED — QR window closed, offer retry */}
      {qrState === "expired" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ padding: "20px", border: "1px solid var(--fg20)", background: "var(--fg05, rgba(26,26,26,0.03))" }}>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#ff9800", marginBottom: "8px" }}>QR Expired</p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: 1.7, color: "var(--fg60)", margin: 0 }}>
              The 5-minute payment window has closed. Please generate a new QR code to complete your purchase.
            </p>
          </div>
          <button onClick={generateQR}
            style={{ alignSelf: "flex-start", background: "var(--fg)", border: "none", color: "var(--bg)", fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", padding: "13px 24px", cursor: "pointer", transition: "opacity 0.2s ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Retry — Generate New QR
          </button>
          <button onClick={onBack}
            style={{ background: "none", border: "none", fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg40)", cursor: "pointer", alignSelf: "flex-start", padding: 0 }}
          >
            ← Back to checkout
          </button>
        </div>
      )}

      {/* FAILED — payment rejected, offer retry or back */}
      {qrState === "failed" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ padding: "20px", border: "1px solid rgba(220,50,50,0.3)", background: "rgba(220,50,50,0.03)" }}>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(220,50,50,0.8)", marginBottom: "8px" }}>Payment Failed</p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: 1.7, color: "var(--fg60)", margin: 0 }}>
              {statusMsg || "The payment could not be completed. Please try again."}
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button onClick={generateQR}
              style={{ background: "var(--fg)", border: "none", color: "var(--bg)", fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", padding: "13px 24px", cursor: "pointer", transition: "opacity 0.2s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Try Again
            </button>
            <button onClick={onBack}
              style={{ background: "transparent", border: "1px solid var(--fg20)", color: "var(--fg)", fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", padding: "13px 24px", cursor: "pointer" }}
            >
              Back to Checkout
            </button>
          </div>
        </div>
      )}

      {/* ERROR — API/network failure when generating QR */}
      {qrState === "error" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.06em", color: "rgba(220,50,50,0.8)", lineHeight: 1.6 }}>
            ⚠ {statusMsg}
          </p>
          <button onClick={generateQR}
            style={{ alignSelf: "flex-start", background: "transparent", border: "1px solid var(--fg)", color: "var(--fg)", fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", padding: "13px 24px", cursor: "pointer", transition: "background 0.2s ease, color 0.2s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--fg)"; e.currentTarget.style.color = "var(--bg)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--fg)"; }}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
// ── END NEW: UPIPaymentPanel ────────────────────────────────────────────────

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const [country, setCountry] = useState("IN");
  const total = useSelector(selectCartTotal(country));
  const symbol = getSymbol(country);

  const [step, setStep] = useState("cart");
  const [upsellAdded, setUpsellAdded] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountError, setDiscountError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apt: "",
    city: "",
    state: "",
    pin: "",
    nameOnCard: "",
    emailOffers: true,
  });

  const titleRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

   // ── NEW: state for payment method selection and UPI order flow ─────────────
  // paymentMethod: which tab is active — "upi" (default) or "card"
  const [paymentMethod,    setPaymentMethod]    = useState("upi");
  // currentOrderId: set after backend order is created, passed to UPIPaymentPanel
  const [currentOrderId,   setCurrentOrderId]   = useState(null);
  // orderCreateState: "idle" | "creating" | "ready"
  //   idle    → show "Pay via UPI" button
  //   creating → show spinner while backend creates order
  //   ready   → show UPIPaymentPanel with the orderId
  const [orderCreateState, setOrderCreateState] = useState("idle");
  // ── END NEW state ──────────────────────────────────────────────────────────

  useEffect(() => {
    getUserCountry().then(setCountry);
  }, []);

  // GSAP entrance on step change
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { yPercent: 110 },
          { yPercent: 0, duration: 1.1, ease: "power4.out", delay: 0.1 },
        );
      }
      [leftRef, rightRef].forEach((ref, i) => {
        if (ref.current) {
          gsap.fromTo(
            ref.current,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: "power3.out",
              delay: 0.25 + i * 0.15,
            },
          );
        }
      });
    });
    return () => ctx.revert();
  }, [step]);

  const handleField = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const discountAmount = discountApplied ? Math.round(total * 0.1) : 0;
  const upsellTotal = upsellAdded ? UPSELL.priceIN : 0;
  const finalTotal = total - discountAmount + upsellTotal;

  const applyDiscount = () => {
    if (discountCode.trim().toLowerCase() === "welcome10") {
      setDiscountApplied(true);
      setDiscountError("");
    } else {
      setDiscountApplied(false);
      setDiscountError("Invalid discount code.");
    }
  };

  // ── Empty cart guard ────────────────────────────────────
  if (!items.length) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
          padding: "20px",
        }}
      >
        <p
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.2rem",
            fontStyle: "italic",
            color: "var(--fg40)",
          }}
        >
          Your cart is empty.
        </p>
        <button
          onClick={() => navigate("/shop")}
          style={{
            background: "var(--fg)",
            border: "none",
            borderRadius: "9999px",
            color: "var(--bg)",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.62rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            padding: "13px 28px",
            cursor: "pointer",
          }}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  // ── Razorpay payment handler ────────────────────────────
  const handlePayNow = async () => {
    if (!form.email.trim()) {
      setError("Email address is required to receive your files.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Step 1 — Create order on backend
      const orderData = await createRazorpayOrder({
        items: items.map((i) => ({ productId: i._id, quantity: i.quantity })),
        email: form.email.trim().toLowerCase(),
        name: `${form.firstName} ${form.lastName}`.trim() || form.email.trim(),
      });

      // Step 2 — Open Razorpay checkout modal
      const options = {
        key: orderData.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount, // paise from backend
        currency: "INR",
        name: "Tarun Mistry",
        description: `${items.length} item${items.length !== 1 ? "s" : ""}`,
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email.trim(),
        },
        notes: {
          order_db_id: orderData.orderId,
        },
        theme: { color: "#204874" },

        // Step 3 — Payment successful
        handler: async (response) => {
          try {
            await verifyRazorpay({
              orderId: orderData.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            // Clear cart and go to success page
            dispatch(clearCart());
            navigate("/order-success", {
              state: {
                email: form.email.trim(),
                orderId: orderData.orderId,
                name: `${form.firstName} ${form.lastName}`.trim() || "there",
              },
            });
          } catch (verifyErr) {
            setError(
              "Payment received but confirmation failed. Please contact support with your payment ID: " +
                response.razorpay_payment_id,
            );
            setLoading(false);
          }
        },

        // Modal dismissed by user
        modal: {
          ondismiss: () => {
            setLoading(false);
            setError("");
          },
        },
      };

      const rzp = new window.Razorpay(options);

      // Payment failed inside modal
      rzp.on("payment.failed", (resp) => {
        setError(
          resp.error?.description ||
            "Payment failed. Please try a different payment method.",
        );
        setLoading(false);
      });

      rzp.open();
    } catch (err) {
      setError(err.message || "Could not initiate payment. Please try again.");
      setLoading(false);
    }
  };

   // ── NEW: create backend order before showing QR panel ─────────────────────
  // Separated from QR generation so the order exists in DB before we request a QR.
  // Validates email first — user must provide it before we create an order.
  const handlePrepareUPI = async () => {
    if (!form.email.trim()) { setError("Email address is required to receive your files."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) { setError("Please enter a valid email address."); return; }
    setOrderCreateState("creating");
    setError("");
    try {
      const orderData = await createRazorpayOrder({
        items: items.map((i) => ({ productId: i._id, quantity: i.quantity })),
        email: form.email.trim().toLowerCase(),
        name:  `${form.firstName} ${form.lastName}`.trim() || form.email.trim(),
      });
      setCurrentOrderId(orderData.orderId);
      setOrderCreateState("ready"); // triggers UPIPaymentPanel to render
    } catch (err) {
      setError(err.message || "Could not create order. Please try again.");
      setOrderCreateState("idle");
    }
  };

  // ── NEW: called by UPIPaymentPanel when polling confirms paid status ───────
  const handleUPISuccess = ({ email: paidEmail, orderId: paidOrderId }) => {
    dispatch(clearCart());
    navigate("/order-success", {
      state: {
        email:   paidEmail || form.email.trim(),
        orderId: paidOrderId || currentOrderId,
        name:    `${form.firstName} ${form.lastName}`.trim() || "there",
      },
    });
  };

  // ── NEW: reset UPI state when user cancels or goes back ───────────────────
  const handleUPIBack = () => {
    setCurrentOrderId(null);
    setOrderCreateState("idle");
  };
  // ── END NEW functions ──────────────────────────────────────────────────────

  // ════════════════════════════════════════════════════════
  // CART VIEW
  // ════════════════════════════════════════════════════════
  if (step === "cart") {
    return (
      <div
        style={{
          background: "var(--bg)",
          color: "var(--fg)",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            padding:
              "clamp(90px,11vh,120px) clamp(20px,5vw,80px) clamp(60px,8vw,100px)",
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          {/* Title */}
          <div
            style={{
              overflow: "hidden",
              textAlign: "center",
              marginBottom: "10px",
            }}
          >
            <h1
              ref={titleRef}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.5rem,7vw,5rem)",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                color: "var(--fg)",
                margin: 0,
              }}
            >
              Your cart
            </h1>
          </div>
          <div
            style={{
              textAlign: "center",
              marginBottom: "clamp(40px,5vw,64px)",
            }}
          >
            <button
              onClick={() => navigate("/shop")}
              style={{
                background: "none",
                border: "none",
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.62rem",
                letterSpacing: "0.08em",
                color: "var(--fg60)",
                cursor: "pointer",
                textDecoration: "underline",
                padding: 0,
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--fg60)")
              }
            >
              Continue shopping
            </button>
          </div>

          {/* Table header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 100px 130px 100px",
              gap: "12px",
              paddingBottom: "12px",
              borderBottom: "1px solid var(--fg20)",
            }}
            className="cart-table-header"
          >
            {["Product", "Price", "Quantity", "Total"].map((h, i) => (
              <p
                key={h}
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.58rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--fg40)",
                  margin: 0,
                  textAlign: i > 0 ? "right" : "left",
                }}
              >
                {h}
              </p>
            ))}
          </div>

          {/* Cart items */}
          {items.map((item) => {
            const itemPrice = item.price?.IN ?? item.price?.US ?? 0;
            return (
              <div
                key={item._id}
                className="cart-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 100px 130px 100px",
                  gap: "12px",
                  alignItems: "center",
                  padding: "22px 0",
                  borderBottom: "1px solid var(--fg10)",
                }}
              >
                {/* Product */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    minWidth: 0,
                  }}
                >
                  <img
                    src={item.coverImage}
                    alt={item.name}
                    style={{
                      width: "52px",
                      height: "65px",
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "0.95rem",
                        color: "var(--fg)",
                        margin: "0 0 6px",
                        lineHeight: 1.3,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.name}
                    </p>
                    <button
                      onClick={() => dispatch(removeItem(item._id))}
                      style={{
                        background: "none",
                        border: "none",
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "0.55rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--fg40)",
                        cursor: "pointer",
                        padding: 0,
                        textDecoration: "underline",
                        transition: "color 0.2s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--fg)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--fg40)")
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Price */}
                <p
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.8rem",
                    color: "var(--fg)",
                    margin: 0,
                    textAlign: "right",
                  }}
                >
                  ₹{itemPrice}
                </p>

                {/* Quantity */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    justifyContent: "flex-end",
                  }}
                >
                  {["−", "+"].map((l, idx) => (
                    <button
                      key={l}
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            id: item._id,
                            quantity: item.quantity + (idx === 0 ? -1 : 1),
                          }),
                        )
                      }
                      style={{
                        background: "none",
                        border: "1px solid var(--fg20)",
                        color: "var(--fg)",
                        width: "24px",
                        height: "24px",
                        cursor: "pointer",
                        fontSize: "13px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "background 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--fg)";
                        e.currentTarget.style.color = "var(--bg)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "var(--fg)";
                      }}
                    >
                      {l}
                    </button>
                  ))}
                  <span
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.7rem",
                      minWidth: "18px",
                      textAlign: "center",
                    }}
                  >
                    {item.quantity}
                  </span>
                </div>

                {/* Line total */}
                <p
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.8rem",
                    color: "var(--fg)",
                    margin: 0,
                    textAlign: "right",
                  }}
                >
                  ₹{itemPrice * item.quantity}
                </p>
              </div>
            );
          })}

          {/* Upsell */}
          <div
            style={{
              margin: "clamp(28px,4vw,44px) 0",
              padding: "clamp(18px,2.5vw,28px)",
              border: "1px solid var(--fg20)",
            }}
          >
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.58rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--fg40)",
                marginBottom: "6px",
              }}
            >
              Special one time offer...
            </p>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.88rem",
                color: "var(--fg60)",
                marginBottom: "16px",
                lineHeight: 1.6,
              }}
            >
              Add <strong style={{ color: "var(--fg)" }}>{UPSELL.name}</strong>{" "}
              and save an extra {UPSELL.discount}% — this page only.
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                flexWrap: "wrap",
              }}
            >
              <img
                src={UPSELL.image}
                alt={UPSELL.name}
                style={{
                  width: "60px",
                  height: "75px",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "0.9rem",
                    color: "var(--fg)",
                    marginBottom: "4px",
                  }}
                >
                  {UPSELL.name}
                </p>
                <p
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.7rem",
                    margin: 0,
                  }}
                >
                  <strong>₹{UPSELL.priceIN}</strong>{" "}
                  <span
                    style={{
                      color: "var(--fg40)",
                      textDecoration: "line-through",
                    }}
                  >
                    ₹{UPSELL.origIN}
                  </span>{" "}
                  <span style={{ color: "#e05" }}>
                    ({UPSELL.discount}% off)
                  </span>
                </p>
              </div>
              <button
                onClick={() => setUpsellAdded((v) => !v)}
                style={{
                  background: upsellAdded ? "var(--fg)" : "transparent",
                  border: "1.5px solid var(--fg)",
                  color: upsellAdded ? "var(--bg)" : "var(--fg)",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.58rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "9px 18px",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {upsellAdded ? "✓ Added" : "Add to cart"}
              </button>
            </div>
          </div>

          {/* Subtotal + checkout */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ width: "clamp(260px,35vw,340px)" }}>
              {/* Discount */}
              <div
                style={{
                  display: "flex",
                  marginBottom: discountError ? "6px" : "20px",
                }}
              >
                <input
                  type="text"
                  placeholder="Discount code"
                  value={discountCode}
                  onChange={(e) => {
                    setDiscountCode(e.target.value);
                    setDiscountError("");
                  }}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "1px solid var(--fg20)",
                    borderRight: "none",
                    color: "var(--fg)",
                    fontFamily: "'Space Mono',monospace",
                    fontSize: "0.62rem",
                    padding: "11px 14px",
                    outline: "none",
                    letterSpacing: "0.04em",
                  }}
                />
                <button
                  onClick={applyDiscount}
                  style={{
                    background: "transparent",
                    border: "1px solid var(--fg20)",
                    color: "var(--fg)",
                    fontFamily: "'Space Mono',monospace",
                    fontSize: "0.58rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "11px 16px",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "background 0.2s ease, color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--fg)";
                    e.currentTarget.style.color = "var(--bg)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--fg)";
                  }}
                >
                  Apply
                </button>
              </div>
              {discountError && (
                <p
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: "0.55rem",
                    color: "#e05",
                    marginBottom: "14px",
                  }}
                >
                  {discountError}
                </p>
              )}
              {discountApplied && (
                <p
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: "0.58rem",
                    color: "#4caf50",
                    marginBottom: "14px",
                  }}
                >
                  10% discount applied ✓
                </p>
              )}

              {/* Price breakdown */}
              <div
                style={{
                  borderTop: "1px solid var(--fg20)",
                  paddingTop: "16px",
                }}
              >
                {discountApplied && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Space Mono',monospace",
                        fontSize: "0.6rem",
                        color: "var(--fg60)",
                      }}
                    >
                      Discount (10%)
                    </span>
                    <span
                      style={{
                        fontFamily: "'Space Mono',monospace",
                        fontSize: "0.7rem",
                        color: "#4caf50",
                      }}
                    >
                      -₹{discountAmount}
                    </span>
                  </div>
                )}
                {upsellAdded && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Space Mono',monospace",
                        fontSize: "0.6rem",
                        color: "var(--fg60)",
                        maxWidth: "160px",
                        lineHeight: 1.4,
                      }}
                    >
                      + {UPSELL.name}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Space Mono',monospace",
                        fontSize: "0.7rem",
                        color: "var(--fg)",
                      }}
                    >
                      ₹{UPSELL.priceIN}
                    </span>
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: "6px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Space Mono',monospace",
                      fontSize: "0.65rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--fg60)",
                    }}
                  >
                    Subtotal
                  </span>
                  <span
                    style={{
                      fontFamily: "'Space Mono',monospace",
                      fontSize: "0.9rem",
                      color: "var(--fg)",
                    }}
                  >
                    ₹{finalTotal} INR
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: "0.53rem",
                    color: "var(--fg40)",
                    textAlign: "right",
                    marginBottom: "20px",
                  }}
                >
                  Taxes calculated at checkout
                </p>

                <button
                  onClick={() => setStep("checkout")}
                  style={{
                    width: "100%",
                    background: "var(--fg)",
                    border: "none",
                    color: "var(--bg)",
                    fontFamily: "'Space Mono',monospace",
                    fontSize: "0.62rem",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    padding: "15px 24px",
                    cursor: "pointer",
                    transition: "opacity 0.25s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  Check Out
                </button>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 600px) {
            .cart-table-header { display: none !important; }
            .cart-row {
              grid-template-columns: 1fr auto !important;
              grid-template-rows: auto auto;
            }
          }
        `}</style>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════
  // CHECKOUT VIEW
  // ════════════════════════════════════════════════════════
  return (
    <div
      style={{
        background: "var(--bg)",
        color: "var(--fg)",
        minHeight: "100vh",
      }}
    >
      <div
        className="checkout-layout"
        style={{
          padding:
            "clamp(80px,10vh,110px) clamp(20px,5vw,60px) clamp(60px,8vw,100px)",
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 400px",
          gap: "clamp(40px,6vw,100px)",
          alignItems: "start",
        }}
      >
        {/* ── LEFT ─────────────────────────────────────── */}
        <div ref={leftRef} style={{ opacity: 0 }}>
          {/* Back */}
          <button
            onClick={() => setStep("cart")}
            style={{
              background: "none",
              border: "none",
              fontFamily: "'Space Mono',monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--fg40)",
              cursor: "pointer",
              padding: 0,
              marginBottom: "32px",
              display: "block",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg40)")}
          >
            ← Back to cart
          </button>

          {/* Contact */}
          <div style={{ marginBottom: "28px" }}>
            <SectionLabel>Contact</SectionLabel>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <Field
                placeholder="Email address *"
                type="email"
                value={form.email}
                onChange={handleField("email")}
                required
              />
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={form.emailOffers}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, emailOffers: e.target.checked }))
                  }
                  style={{
                    width: "14px",
                    height: "14px",
                    accentColor: "var(--fg)",
                    cursor: "pointer",
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: "0.58rem",
                    color: "var(--fg60)",
                    letterSpacing: "0.04em",
                  }}
                >
                  Email me with news and offers
                </span>
              </label>
            </div>
          </div>

          {/* Payment */}
          <div style={{ marginBottom: "28px" }}>
            <SectionLabel>Payment</SectionLabel>
            <p
              style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: "0.57rem",
                letterSpacing: "0.08em",
                color: "var(--fg40)",
                marginBottom: "14px",
              }}
            >
              🔒 All transactions are secure and encrypted via Razorpay.
            </p>

           {/* ── NEW: payment method tab selector ─────────────────────────── */}
            {/* Switches between UPI (default) and Card/Net Banking */}
            <div style={{ display: "flex", gap: "0", marginBottom: "20px", border: "1px solid var(--fg20)" }}>
              {[
                { value: "upi",  label: "UPI / QR Code"      },
                { value: "card", label: "Card / Net Banking"  },
              ].map(({ value, label }) => (
                <button key={value}
                  onClick={() => {
                    setPaymentMethod(value);
                    // Reset UPI state when switching away from UPI tab
                    if (value !== "upi") { setCurrentOrderId(null); setOrderCreateState("idle"); }
                    setError("");
                  }}
                  style={{
                    flex:          1,
                    background:    paymentMethod === value ? "var(--fg)" : "transparent",
                    border:        "none",
                    borderRight:   value === "upi" ? "1px solid var(--fg20)" : "none",
                    color:         paymentMethod === value ? "var(--bg)" : "var(--fg60)",
                    fontFamily:    "'Space Mono', monospace",
                    fontSize:      "0.58rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    padding:       "12px 14px",
                    cursor:        "pointer",
                    transition:    "background 0.2s ease, color 0.2s ease",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            {/* ── END NEW: tab selector ────────────────────────────────────── */}

            {/* ── NEW: UPI tab content ──────────────────────────────────────── */}
            {paymentMethod === "upi" && (
              <>
                {/* Step 1: order not yet created — show "Pay via UPI" button */}
                {orderCreateState === "idle" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", lineHeight: 1.7, color: "var(--fg60)", margin: 0 }}>
                      Enter your email above, then click below to generate a UPI QR code.
                      Pay with Google Pay, PhonePe, Paytm, or any bank app.
                    </p>
                    {/* Error shown here (not at bottom) when method is UPI */}
                    {error && (
                      <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color: "rgba(220,50,50,0.85)", lineHeight: 1.6 }}>⚠ {error}</p>
                    )}
                    <button onClick={handlePrepareUPI}
                      style={{ alignSelf: "flex-start", background: "var(--fg)", border: "none", color: "var(--bg)", fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", padding: "14px 24px", cursor: "pointer", transition: "opacity 0.2s ease" }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                    >
                      Pay ₹{finalTotal} via UPI
                    </button>
                  </div>
                )}

                {/* Step 2: creating order on backend — spinner */}
                {orderCreateState === "creating" && (
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "20px 0" }}>
                    <div style={{ width: "20px", height: "20px", border: "2px solid var(--fg10)", borderTop: "2px solid var(--fg)", borderRadius: "50%", animation: "qrSpin 0.8s linear infinite", flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg40)" }}>
                      Preparing order...
                    </span>
                  </div>
                )}

                {/* Step 3: order created — show QR panel with its own state machine */}
                {orderCreateState === "ready" && currentOrderId && (
                  <UPIPaymentPanel
                    orderId={currentOrderId}
                    finalTotal={finalTotal}
                    email={form.email.trim()}
                    name={`${form.firstName} ${form.lastName}`.trim()}
                    onSuccess={handleUPISuccess}   // redirects to /order-success
                    onBack={handleUPIBack}          // resets back to idle
                  />
                )}
              </>
            )}
            {/* ── END NEW: UPI tab content ──────────────────────────────────── */}

            {/* ── CHANGED: card content moved inside paymentMethod === "card" check */}
            {/* Previously this was always visible. Now only shown when card tab is active. */}
            {paymentMethod === "card" && (
              <>
                <div style={{ border: "1.5px solid var(--fg)", borderRadius: "3px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px", borderBottom: "1px solid var(--fg20)" }}>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.62rem", color: "var(--fg)", letterSpacing: "0.06em" }}>Credit / Debit card</span>
                    <CardIcons />
                  </div>
                  <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <Field placeholder="Card number" value={form.cardNum || ""} onChange={handleField("cardNum")} maxLength={19}
                      icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>}
                    />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <Field placeholder="MM / YY" value={form.expiry || ""} onChange={handleField("expiry")} maxLength={7} />
                      <Field placeholder="CVV" value={form.cvv || ""} onChange={handleField("cvv")} maxLength={4}
                        icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>}
                      />
                    </div>
                    <Field placeholder="Name on card" value={form.nameOnCard} onChange={handleField("nameOnCard")} />
                  </div>
                </div>
                <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.55rem", color: "var(--fg40)", marginTop: "10px", lineHeight: 1.6 }}>
                  Note: Card details are entered inside the Razorpay secure modal when you click Pay Now. The fields above are for display — Razorpay handles all card data.
                </p>
              </>
            )}
          </div>


          {/* Billing address */}
          <div style={{ marginBottom: "32px" }}>
            <SectionLabel>Billing address</SectionLabel>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {/* Country */}
              <div style={{ position: "relative" }}>
                <select
                  defaultValue="IN"
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "1px solid var(--fg20)",
                    color: "var(--fg)",
                    fontFamily: "'Space Mono',monospace",
                    fontSize: "0.65rem",
                    padding: "13px 36px 13px 14px",
                    outline: "none",
                    appearance: "none",
                    cursor: "pointer",
                    letterSpacing: "0.04em",
                    borderRadius: "2px",
                  }}
                >
                  <option value="IN">India</option>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="CA">Canada</option>
                </select>
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 11 11"
                  fill="currentColor"
                  style={{
                    position: "absolute",
                    right: "13px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                    opacity: 0.5,
                  }}
                >
                  <path d="M5.5 8L1 3h9L5.5 8z" />
                </svg>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                <Field
                  placeholder="First name"
                  value={form.firstName}
                  onChange={handleField("firstName")}
                />
                <Field
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={handleField("lastName")}
                />
              </div>
              <Field
                placeholder="Address"
                value={form.address}
                onChange={handleField("address")}
              />
              <Field
                placeholder="Apartment, suite, etc. (optional)"
                value={form.apt}
                onChange={handleField("apt")}
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "10px",
                }}
              >
                <Field
                  placeholder="City"
                  value={form.city}
                  onChange={handleField("city")}
                />
                <Field
                  placeholder="State"
                  value={form.state}
                  onChange={handleField("state")}
                />
                <Field
                  placeholder="PIN code"
                  value={form.pin}
                  onChange={handleField("pin")}
                />
              </div>
            </div>
          </div>

          {/* Error */}
          {error && paymentMethod === "card" && (
            <p
              style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.06em",
                color: "rgba(220,50,50,0.85)",
                marginBottom: "16px",
                lineHeight: 1.6,
              }}
            >
              ⚠ {error}
            </p>
          )}

          {/* Pay now button — opens Razorpay modal */}
          {paymentMethod === "card" && (
          <button
            onClick={handlePayNow}
            disabled={loading}
            style={{
              width: "100%",
              background: "var(--fg)",
              border: "none",
              color: "var(--bg)",
              fontFamily: "'Space Mono',monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              padding: "16px 24px",
              cursor: loading ? "wait" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "opacity 0.25s ease",
              borderRadius: "2px",
              marginBottom: "20px",
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.opacity = "0.85";
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.opacity = "1";
            }}
          >
            {loading ? "Opening Razorpay..." : `Pay now — ₹${finalTotal}`}
          </button>
        )}

          {/* Footer links */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {[
              { label: "Privacy policy", to: "/privacy" },
              { label: "Terms of service", to: "/terms" },
            ].map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                style={{
                  fontFamily: "'Space Mono',monospace",
                  fontSize: "0.57rem",
                  letterSpacing: "0.05em",
                  color: "var(--fg40)",
                  textDecoration: "underline",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--fg)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--fg40)")
                }
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── RIGHT — Order summary ─────────────────────── */}
        <div
          ref={rightRef}
          style={{ opacity: 0, position: "sticky", top: "100px" }}
        >
          {/* Items */}
          <div style={{ marginBottom: "20px" }}>
            {[
              ...items,
              ...(upsellAdded
                ? [
                    {
                      _id: "upsell",
                      coverImage: UPSELL.image,
                      name: UPSELL.name,
                      category: "bundle",
                      quantity: 1,
                      price: { IN: UPSELL.priceIN },
                    },
                  ]
                : []),
            ].map((item) => {
              const p = item.price?.IN ?? item.price?.US ?? 0;
              return (
                <div
                  key={item._id}
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "start",
                    paddingBottom: "14px",
                    marginBottom: "14px",
                    borderBottom: "1px solid var(--fg10)",
                  }}
                >
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <img
                      src={item.coverImage}
                      alt={item.name}
                      style={{
                        width: "52px",
                        height: "65px",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        top: "-7px",
                        right: "-7px",
                        background: "var(--fg)",
                        color: "var(--bg)",
                        width: "17px",
                        height: "17px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "'Space Mono',monospace",
                        fontSize: "0.5rem",
                      }}
                    >
                      {item.quantity}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: "'Playfair Display',serif",
                        fontSize: "0.88rem",
                        color: "var(--fg)",
                        margin: "0 0 3px",
                        lineHeight: 1.3,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.name}
                    </p>
                    <p
                      style={{
                        fontFamily: "'Space Mono',monospace",
                        fontSize: "0.55rem",
                        color: "var(--fg40)",
                        margin: 0,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {item.category}
                    </p>
                  </div>
                  <p
                    style={{
                      fontFamily: "'Space Mono',monospace",
                      fontSize: "0.78rem",
                      color: "var(--fg)",
                      flexShrink: 0,
                    }}
                  >
                    ₹{p * item.quantity}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Discount code */}
          <div style={{ display: "flex", marginBottom: "6px" }}>
            <input
              type="text"
              placeholder="Discount code"
              value={discountCode}
              onChange={(e) => {
                setDiscountCode(e.target.value);
                setDiscountError("");
              }}
              style={{
                flex: 1,
                background: "transparent",
                border: "1px solid var(--fg20)",
                borderRight: "none",
                color: "var(--fg)",
                fontFamily: "'Space Mono',monospace",
                fontSize: "0.6rem",
                padding: "11px 13px",
                outline: "none",
                letterSpacing: "0.04em",
                minWidth: 0,
              }}
            />
            <button
              onClick={applyDiscount}
              style={{
                background: "transparent",
                border: "1px solid var(--fg20)",
                color: "var(--fg)",
                fontFamily: "'Space Mono',monospace",
                fontSize: "0.58rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "11px 14px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "background 0.2s ease, color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--fg)";
                e.currentTarget.style.color = "var(--bg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--fg)";
              }}
            >
              Apply
            </button>
          </div>
          {discountApplied && (
            <p
              style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: "0.56rem",
                color: "#4caf50",
                marginBottom: "12px",
              }}
            >
              10% discount applied ✓
            </p>
          )}
          {discountError && (
            <p
              style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: "0.56rem",
                color: "#e05",
                marginBottom: "12px",
              }}
            >
              {discountError}
            </p>
          )}

          {/* Total */}
          <div
            style={{ borderTop: "1px solid var(--fg20)", paddingTop: "16px" }}
          >
            {discountApplied && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: "0.6rem",
                    color: "var(--fg60)",
                  }}
                >
                  Discount
                </span>
                <span
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: "0.7rem",
                    color: "#4caf50",
                  }}
                >
                  -₹{discountAmount}
                </span>
              </div>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  fontFamily: "'Space Mono',monospace",
                  fontSize: "0.68rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--fg)",
                }}
              >
                Total
              </span>
              <div>
                <span
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: "0.62rem",
                    color: "var(--fg40)",
                    marginRight: "6px",
                  }}
                >
                  INR
                </span>
                <span
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    color: "var(--fg)",
                  }}
                >
                  ₹{finalTotal}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .checkout-layout {
            grid-template-columns: 1fr !important;
          }
          .checkout-layout > div:last-child {
            position: static !important;
            order: -1;
          }
        }
      `}</style>
    </div>
  );
}
