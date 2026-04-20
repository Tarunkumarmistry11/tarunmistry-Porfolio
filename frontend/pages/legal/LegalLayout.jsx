import { useEffect, useRef } from "react";
import { useNavigate }       from "react-router-dom";
import { gsap }              from "gsap";

export default function LegalLayout({ title, subtitle, children }) {
  const titleRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    gsap.fromTo(el,
      { yPercent: 110 },
      { yPercent: 0, duration: 1.1, ease: "power4.out", delay: 0.15 }
    );
  }, []);

  return (
    <div style={{
      background: "var(--bg)",
      color:      "var(--fg)",
      minHeight:  "100vh",
      overflowX:  "hidden",
    }}>
      {/* Hero */}
      <section style={{
        padding:  "clamp(100px,12vh,140px) clamp(20px,5vw,80px) clamp(40px,5vh,64px)",
        maxWidth: "1100px",
        margin:   "0 auto",
        borderBottom: "1px solid var(--fg20, rgba(26,26,26,0.15))",
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background:    "none",
            border:        "none",
            fontFamily:    "'Space Mono', monospace",
            fontSize:      "0.8rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color:         "var(--fg40, rgba(26,26,26,0.4))",
            cursor:        "pointer",
            marginBottom:  "32px",
            padding:       0,
            display:       "block",
            transition:    "color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg40)")}
        >
          ← Back
        </button>

        <div style={{ overflow: "hidden" }}>
          <h1
            ref={titleRef}
            style={{
              fontFamily:    "'Playfair Display', serif",
              fontSize:      "clamp(3rem,9vw,5rem)",
              fontWeight:    400,
              lineHeight:    0.92,
              letterSpacing: "-0.025em",
              color:         "var(--fg)",
              margin:        "0 0 20px",
            }}
          >
            {title}
          </h1>
        </div>

        {subtitle && (
          <p style={{
            fontFamily:    "'Space Mono', monospace",
            fontSize:      "0.62rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color:         "var(--fg40, rgba(26,26,26,0.4))",
            margin:        0,
          }}>
            {subtitle}
          </p>
        )}
      </section>

      {/* Content */}
      <section style={{
        padding:  "clamp(48px,7vw,80px) clamp(20px,5vw,80px) clamp(80px,10vw,120px)",
        maxWidth: "1200px",
        margin:   "0 auto",
      }}>
        {children}
      </section>
    </div>
  );
}