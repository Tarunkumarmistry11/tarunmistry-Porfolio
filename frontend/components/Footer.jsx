import { useCopyToClipboard } from "../hooks/useCopyToClipboard";

const EMAIL = "photo@giuligartner.com";

const SOCIALS = [
  { label: "YouTube",    href: "https://www.youtube.com/user/Giuligartner" },
  { label: "Instagram",  href: "https://www.instagram.com/giuligartner/"   },
  { label: "Twitter",    href: "https://twitter.com/giuligartner"           },
];

export default function Footer() {
  const { copied, copy } = useCopyToClipboard();

  return (
    <footer className="footer-root" style={{ padding: "80px 48px 48px" }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>

        <p style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "0.65rem", letterSpacing: "0.14em",
          textTransform: "uppercase", color: "var(--warm)",
          marginBottom: "12px",
        }}>
          get in touch
        </p>

        <button
          onClick={() => copy(EMAIL)}
          style={{
            background: "none", border: "none",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.65rem", letterSpacing: "0.1em",
            color: "var(--bg)", opacity: 0.5,
            marginBottom: "8px", display: "block",
            transition: "opacity 0.25s",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.5")}
        >
          {copied ? "copied ✨" : "click to copy"}
        </button>

        <h2
          onClick={() => copy(EMAIL)}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.8rem, 4vw, 3.5rem)",
            fontWeight: 400, color: "var(--bg)",
            marginBottom: "64px", cursor: "pointer",
            transition: "opacity 0.25s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          {EMAIL}
        </h2>

        <div style={{
          display: "flex", flexWrap: "wrap",
          alignItems: "flex-end", justifyContent: "space-between",
          gap: "24px",
          borderTop: "1px solid rgba(245,240,235,0.12)",
          paddingTop: "32px",
        }}>
          <div>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic", fontSize: "1.1rem",
              color: "var(--bg)",
            }}>giulia gartner</p>
            <p style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.6rem", color: "var(--bg)",
              opacity: 0.35, marginTop: "4px",
            }}>20XX</p>
          </div>

          <div style={{ display: "flex", gap: "28px" }}>
            {SOCIALS.map(({ label, href }) => (
              <a key={label} href={href}
                 target="_blank" rel="noopener noreferrer"
                 style={{
                   fontFamily: "'Space Mono', monospace",
                   fontSize: "0.65rem", letterSpacing: "0.12em",
                   textTransform: "uppercase", color: "var(--bg)",
                   opacity: 0.5, textDecoration: "none",
                   transition: "opacity 0.25s",
                 }}
                 onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                 onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.5")}
              >
                {label}
              </a>
            ))}
          </div>

          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.6rem", color: "var(--bg)", opacity: 0.3,
          }}>
            design & dev ✦{" "}
            <a href="https://twitter.com/est_ce_thomas"
               target="_blank" rel="noopener noreferrer"
               style={{ color: "inherit", opacity: 1, textDecoration: "none" }}>
              thomas bosc
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}