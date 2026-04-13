import { useCopyToClipboard } from "../hooks/useCopyToClipboard";

const EMAIL = "photo@giuligartner.com";

const SOCIALS = [
  { label: "YOUTUBE", href: "https://www.youtube.com/user/Giuligartner" },
  { label: "INSTAGRAM", href: "https://www.instagram.com/giuligartner/" },
  { label: "TWITTER", href: "https://twitter.com/giuligartner" },
];

export default function Footer() {
  const { copied, copy } = useCopyToClipboard();

  return (
    <footer
      style={{
        background: "var(--bg)",
        color: "var(--fg)",
        padding: "clamp(80px, 10vh, 120px) 24px 60px",
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
            padding: "18px 48px",
            marginBottom: "80px",
            cursor: "pointer",
            transition: "all 0.3s ease",
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
              fontSize: "clamp(1.8rem, 4.5vw, 3.2rem)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              margin: 0,
              color: "var(--fg)",
            }}
          >
            {EMAIL}
          </h2>
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.65rem",
              color: copied ? "var(--success)" : "var(--fg40)",
              marginTop: "6px",
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
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
            paddingTop: "32px",
            borderTop: "1px solid var(--border)",
          }}
        >
          {/* Left - Copyright */}
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.65rem",
              color: "var(--fg40)",
              margin: 0,
            }}
          >
            GIULIA GARTNER © {new Date().getFullYear()}
          </p>

          {/* Center - Social Links */}
          <div style={{ display: "flex", gap: "12px" }}>
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
                  padding: "8px 20px",
                  borderRadius: "9999px",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
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

          {/* Right - Credit */}
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.65rem",
              color: "var(--fg40)",
              margin: 0,
            }}
          >
            DESIGN &amp; DEV ✦{" "}
            <a
              href="https://twitter.com/est_ce_thomas"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--fg)", textDecoration: "none" }}
            >
              THOMAS BOSC
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}