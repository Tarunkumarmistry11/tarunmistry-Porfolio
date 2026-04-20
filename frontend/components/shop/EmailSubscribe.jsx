import { useEffect, useRef, useState } from "react";
import { gsap }                        from "gsap";
import { ScrollTrigger }               from "gsap/ScrollTrigger";
import { subscribeEmail }              from "../../api/newsletterApi";

gsap.registerPlugin(ScrollTrigger);

export default function EmailSubscribe() {
  const [email,   setEmail]   = useState("");
  const [status,  setStatus]  = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const sectionRef  = useRef(null);
  const inputRef    = useRef(null);
  const feedbackRef = useRef(null);

  // Validate email format
  const isValid = (val) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  // Scroll reveal on mount
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { opacity: 0, y: 28 },
        {
          opacity:  1,
          y:        0,
          duration: 1,
          ease:     "power3.out",
          scrollTrigger: {
            trigger: el,
            start:   "top 90%",
            once:    true,
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  // Animate success feedback in
  useEffect(() => {
    if (status === "success" && feedbackRef.current) {
      gsap.fromTo(feedbackRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );
    }
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      // Shake input
      gsap.fromTo(inputRef.current,
        { x: 0 },
        { x: [-8, 8, -6, 6, -4, 4, 0], duration: 0.5, ease: "power2.inOut" }
      );
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const data = await subscribeEmail(email.trim().toLowerCase());
      setStatus("success");
      setMessage(data.message || "You're subscribed.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Something went wrong. Please try again.");
      // Shake on server error too
      gsap.fromTo(inputRef.current,
        { x: 0 },
        { x: [-8, 8, -6, 6, -4, 4, 0], duration: 0.5, ease: "power2.inOut" }
      );
    }
  };

  const borderColor = status === "error"
    ? "rgba(220,50,50,0.6)"
    : "var(--fg20, rgba(26,26,26,0.2))";

  return (
    <div
      ref={sectionRef}
      style={{
        padding:  "clamp(60px,8vw,100px) clamp(20px,5vw,80px)",
        maxWidth: "1300px",
        margin:   "0 auto",
        opacity:  0,
      }}
    >
      <div
        className="subscribe-grid"
        style={{
          display:             "grid",
          gridTemplateColumns: "1fr 1fr",
          gap:                 "clamp(32px,5vw,80px)",
          alignItems:          "start",
        }}
      >
        {/* ── Left — heading + subtitle ──────────────── */}
        <div>
          <h2 style={{
            fontFamily:    "'Playfair Display', serif",
            fontSize:      "clamp(1.6rem,3.5vw,2.4rem)",
            fontWeight:    400,
            color:         "var(--fg)",
            margin:        "0 0 10px",
            lineHeight:    1.2,
          }}>
            Subscribe to our emails
          </h2>
          <p style={{
            fontFamily:    "'Space Mono', monospace",
            fontSize:      "0.6rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color:         "var(--fg40, rgba(26,26,26,0.4))",
            margin:        0,
          }}>
            New releases · Updates · Cinematic inspiration
          </p>
        </div>

        {/* ── Right — form or success state ─────────── */}
        <div>
          {status === "success" ? (
            // Success state
            <div ref={feedbackRef} style={{ opacity: 0 }}>
              <p style={{
                fontFamily:   "'Playfair Display', serif",
                fontSize:     "clamp(1rem,1.8vw,1.2rem)",
                fontStyle:    "italic",
                color:        "var(--fg)",
                marginBottom: "6px",
              }}>
                You're in.
              </p>
              <p style={{
                fontFamily:    "'Space Mono', monospace",
                fontSize:      "0.6rem",
                letterSpacing: "0.1em",
                color:         "var(--fg40, rgba(26,26,26,0.4))",
                margin:        0,
              }}>
                {message}
              </p>
            </div>
          ) : (
            // Form state
            <form
              onSubmit={handleSubmit}
              noValidate
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {/* Input + button row */}
              <div style={{ display: "flex" }}>
                <input
                  ref={inputRef}
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    // Clear error on typing
                    if (status === "error") {
                      setStatus("idle");
                      setMessage("");
                    }
                  }}
                  disabled={status === "loading"}
                  style={{
                    flex:          1,
                    background:    "transparent",
                    border:        `1px solid ${borderColor}`,
                    borderRight:   "none",
                    color:         "var(--fg)",
                    fontFamily:    "'Space Mono', monospace",
                    fontSize:      "0.72rem",
                    letterSpacing: "0.04em",
                    padding:       "13px 16px",
                    outline:       "none",
                    minWidth:      0,
                    transition:    "border-color 0.25s ease",
                  }}
                  onFocus={(e) => {
                    if (status !== "error")
                      e.target.style.borderColor = "var(--fg)";
                  }}
                  onBlur={(e) => {
                    if (status !== "error")
                      e.target.style.borderColor =
                        "var(--fg20, rgba(26,26,26,0.2))";
                  }}
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  aria-label="Subscribe"
                  style={{
                    background:  "transparent",
                    border:      `1px solid ${borderColor}`,
                    color:       "var(--fg)",
                    padding:     "13px 18px",
                    cursor:      status === "loading" ? "wait" : "pointer",
                    fontSize:    "1rem",
                    lineHeight:  1,
                    flexShrink:  0,
                    transition:  "background 0.25s ease, color 0.25s ease, border-color 0.25s ease",
                    display:     "flex",
                    alignItems:  "center",
                    justifyContent: "center",
                    minWidth:    "48px",
                  }}
                  onMouseEnter={(e) => {
                    if (status === "loading") return;
                    e.currentTarget.style.background  = "var(--fg)";
                    e.currentTarget.style.color       = "var(--bg)";
                    e.currentTarget.style.borderColor = "var(--fg)";
                  }}
                  onMouseLeave={(e) => {
                    if (status === "loading") return;
                    e.currentTarget.style.background  = "transparent";
                    e.currentTarget.style.color       = "var(--fg)";
                    e.currentTarget.style.borderColor = borderColor;
                  }}
                >
                  {status === "loading" ? (
                    // CSS spinner
                    <span style={{
                      display:         "block",
                      width:           "12px",
                      height:          "12px",
                      border:          "1.5px solid currentColor",
                      borderTopColor:  "transparent",
                      borderRadius:    "50%",
                      animation:       "emailSpinAnim 0.7s linear infinite",
                    }} />
                  ) : (
                    "→"
                  )}
                </button>
              </div>

              {/* Error message */}
              {status === "error" && message && (
                <p style={{
                  fontFamily:    "'Space Mono', monospace",
                  fontSize:      "0.58rem",
                  letterSpacing: "0.06em",
                  color:         "rgba(220,50,50,0.8)",
                  margin:        0,
                }}>
                  {message}
                </p>
              )}
            </form>
          )}
        </div>
      </div>

      {/* Scoped styles */}
      <style>{`
        @keyframes emailSpinAnim {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 640px) {
          .subscribe-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </div>
  );
}