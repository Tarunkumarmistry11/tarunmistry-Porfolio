import { useCopyToClipboard } from "../hooks/useCopyToClipboard";

const EMAIL = "photo@giuligartner.com";

const SOCIALS = [
  { label: "YOUTUBE", href: "/" },
  { label: "INSTAGRAM", href: "https://www.instagram.com/el3v_3n/?hl=en" },
  { label: "TWITTER", href: "/" },
];

export default function Footer() {
  const { copied, copy } = useCopyToClipboard();

  return (
    <footer
      style={{
        background: "var(--bg)",
        color: "var(--fg)",
        padding: "clamp(80px, 12vh, 140px) 20px 80px",
        textAlign: "center",
        position: "relative",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* GET IN TOUCH */}
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.68rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--fg40)",
            marginBottom: "24px",
          }}
        >
          GET IN TOUCH
        </p>

        {/* Email Address - Click to Copy */}
        <div
          onClick={() => copy(EMAIL)}
          style={{
            display: "inline-block",
            background: "transparent",
            border: "1px solid var(--fg30)",
            borderRadius: "9999px",
            padding: "clamp(18px, 4vw, 22px) clamp(32px, 8vw, 48px)",
            marginBottom: "clamp(60px, 8vh, 90px)",
            cursor: "pointer",
            transition: "all 0.3s ease",
            maxWidth: "100%",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--fg)";
            e.currentTarget.style.background = "var(--fg05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--fg30)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.6rem, 5.5vw, 3.2rem)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              margin: 0,
              color: "var(--fg)",
              wordBreak: "break-all",
            }}
          >
            {EMAIL}
          </h2>
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.65rem",
              color: copied ? "var(--success)" : "var(--fg40)",
              marginTop: "8px",
              transition: "color 0.3s ease",
            }}
          >
            {copied ? "COPIED ✨" : "CLICK TO COPY"}
          </p>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "clamp(24px, 5vw, 40px)",
            paddingTop: "32px",
            borderTop: "1px solid var(--border)",
          }}
        >
          {/* Copyright */}
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.65rem",
              color: "var(--fg40)",
              margin: 0,
            }}
          >
            TARUN MISTRY © {new Date().getFullYear()}
          </p>

          {/* Social Links */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
            {SOCIALS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--fg)",
                  border: "1px solid var(--fg30)",
                  padding: "10px 22px",
                  borderRadius: "9999px",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--fg)";
                  e.currentTarget.style.background = "var(--fg05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--fg30)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}