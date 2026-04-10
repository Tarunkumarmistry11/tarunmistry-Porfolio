import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import ApertureDisplay from "./ApertureDisplay";

const NAV_LINKS = [
  { to: "/stills", label: "Stills" },
  { to: "/motion", label: "Motion" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const location                  = useLocation();
  const navRef                    = useRef(null);

  // GSAP navbar entrance
  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 1.2 }
    );
  }, []);

  // Scroll
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // ESC key
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 50,
          padding: "20px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "background-color 0.5s ease, backdrop-filter 0.5s ease",
          backgroundColor: scrolled ? "color-mix(in srgb, var(--bg) 88%, transparent)" : "transparent",
          backdropFilter: scrolled ? "blur(10px)" : "none",
          opacity: 0,
        }}
      >
        {/* Left links */}
        <div className="desktop-only" style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          {NAV_LINKS.map(({ to, label }) => (
            <Link key={to} to={to} className="nav-link">{label}</Link>
          ))}
        </div>

        {/* Center logo */}
        <Link
          to="/"
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "'Playfair Display', serif",
            fontSize: "0.9rem",
            letterSpacing: "0.08em",
            textDecoration: "none",
            color: "var(--fg)",
          }}
          className="desktop-only"
        >
          G.G.
        </Link>

        {/* Right links */}
        <div className="desktop-only" style={{ display: "flex", gap: "32px", alignItems: "center", marginLeft: "auto" }}>
          <a href="https://www.instagram.com/giuligartner/"
             target="_blank" rel="noopener noreferrer"
             className="nav-link">Instagram</a>
          <a href="mailto:photo@giuligartner.com" className="nav-link">Email</a>
          <ApertureDisplay style={{ marginLeft: "16px" }} />
        </div>

        {/* Mobile button */}
        <button
          type="button"
          aria-label="Toggle menu"
          className="mobile-only"
          onClick={() => setMenuOpen((p) => !p)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.72rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--fg)",
            position: "relative",
            zIndex: 50,
          }}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </nav>

      {/* Mobile fullscreen menu */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          backgroundColor: "var(--bg)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transition: "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "40px" }}>
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "3rem",
                textDecoration: "none",
                color: "var(--fg)",
                fontStyle: "normal",
                transition: "font-style 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.fontStyle = "italic")}
              onMouseLeave={(e) => (e.currentTarget.style.fontStyle = "normal")}
            >
              {label}
            </Link>
          ))}
          <a href="https://www.instagram.com/giuligartner/"
             target="_blank" rel="noopener noreferrer"
             className="nav-link" style={{ marginTop: "16px" }}>Instagram</a>
          <a href="mailto:photo@giuligartner.com" className="nav-link">Email</a>
          <ApertureDisplay style={{ marginTop: "8px" }} />
        </div>
      </div>
    </>
  );
}