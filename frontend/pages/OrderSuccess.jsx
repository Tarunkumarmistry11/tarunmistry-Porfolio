import { useEffect, useRef }        from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch }              from "react-redux";
import { gsap }                     from "gsap";
import { clearCart }                from "../features/cart/cartSlice";

export default function OrderSuccess() {
  const { state }   = useLocation();
  const navigate    = useNavigate();
  const dispatch    = useDispatch();
  const titleRef    = useRef(null);
  const contentRef  = useRef(null);

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  useEffect(() => {
    const titles  = titleRef.current;
    const content = contentRef.current;
    if (!titles || !content) return;

    gsap.set(titles,  { yPercent: 110 });
    gsap.set(content, { opacity: 0, y: 24 });

    const tl = gsap.timeline({ delay: 0.2 });
    tl.to(titles,  { yPercent: 0, duration: 1.2, ease: "power4.out" })
      .to(content, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, "-=0.6");

    return () => tl.kill();
  }, []);

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
      overflow:       "hidden",
    }}>

      {/* Title */}
      <div style={{ overflow:"hidden", marginBottom:"6px" }}>
        <div ref={titleRef}>
          <h1 style={{
            fontFamily:    "'Playfair Display', serif",
            fontSize:      "clamp(3.5rem,11vw,9rem)",
            fontWeight:    400,
            lineHeight:    0.92,
            letterSpacing: "-0.025em",
            color:         "var(--fg)",
            margin:        0,
          }}>
            Your files
          </h1>
        </div>
      </div>
      <div style={{ overflow:"hidden", marginBottom:"48px" }}>
        <h1 style={{
          fontFamily:    "'Playfair Display', serif",
          fontSize:      "clamp(3.5rem,11vw,9rem)",
          fontWeight:    400,
          lineHeight:    0.92,
          letterSpacing: "-0.025em",
          color:         "var(--fg)",
          margin:        0,
          fontStyle:     "italic",
        }}>
          are on their way.
        </h1>
      </div>

      {/* Content */}
      <div ref={contentRef} style={{ opacity:0, maxWidth:"520px" }}>
        {state?.email && (
          <p style={{
            fontFamily:    "'Space Mono', monospace",
            fontSize:      "0.65rem",
            letterSpacing: "0.1em",
            color:         "var(--fg60)",
            marginBottom:  "8px",
          }}>
            Confirmation sent to
          </p>
        )}
        {state?.email && (
          <p style={{
            fontFamily:   "'Playfair Display', serif",
            fontSize:     "1.1rem",
            color:        "var(--fg)",
            marginBottom: "28px",
          }}>
            {state.email}
          </p>
        )}
        <p style={{
          fontFamily:   "'Inter', sans-serif",
          fontSize:     "0.95rem",
          lineHeight:   1.85,
          color:        "var(--fg60)",
          marginBottom: "36px",
        }}>
          Check your inbox for your purchase receipt and download links.
          Links expire in 48 hours — download at your convenience.
        </p>
        <button
          onClick={() => navigate("/shop")}
          style={{
            background:    "none",
            border:        "1px solid var(--fg)",
            color:         "var(--fg)",
            fontFamily:    "'Space Mono', monospace",
            fontSize:      "0.6rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            padding:       "13px 24px",
            cursor:        "pointer",
            transition:    "background 0.25s ease, color 0.25s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background="var(--fg)"; e.currentTarget.style.color="var(--bg)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="var(--fg)"; }}
        >
          Back to Shop
        </button>
      </div>
    </div>
  );
}