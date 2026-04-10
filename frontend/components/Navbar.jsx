import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import ApertureDisplay from "./ApertureDisplay";

const LINKS = [
  { to: "/stills", label: "Stills"  },
  { to: "/motion", label: "Motion"  },
  { to: "/about",  label: "About"   },
];

export default function Navbar() {
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const scrollRef = useRef(false);
  const navRef    = useRef(null);
  const loc       = useLocation();

  /* GSAP entrance */
  useEffect(() => {
    gsap.fromTo(navRef.current,
      { opacity: 0, y: -18 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 1.1 }
    );
  }, []);

  /* scroll */
  useEffect(() => {
    const fn = () => {
      const v = window.scrollY > 20;
      if (v !== scrollRef.current) { scrollRef.current = v; setScrolled(v); }
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* close on route */
  const close = useCallback(() => setOpen(false), []);
  useEffect(() => { close(); }, [loc.pathname, close]);

  /* scroll lock */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  /* ESC */
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  return (
    <>
      {/* ── NAV BAR ───────────────────────────────────────── */}
      <nav ref={navRef} style={{
        position:   "fixed",
        top: 0, left: 0, right: 0,
        zIndex:     100,
        display:    "flex",
        alignItems: "center",
        padding:    "22px clamp(20px,5vw,60px)",
        opacity:    0,                            /* GSAP reveals */
        transition: "background 0.4s ease, backdrop-filter 0.4s ease",
        background: scrolled ? "var(--nbg)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}>

        {/* LEFT — nav links */}
        <div style={{ display:"flex", gap:"36px", alignItems:"center" }}
             className="hide-mobile">
          {LINKS.map(({ to, label }) => (
            <Link key={to} to={to} className="nav-link">{label}</Link>
          ))}
        </div>

        {/* CENTER — logo */}
        <Link to="/" className="hide-mobile" style={{
          position:   "absolute",
          left:       "50%",
          transform:  "translateX(-50%)",
          fontFamily: "'Playfair Display', serif",
          fontSize:   "0.95rem",
          letterSpacing: "0.06em",
          color:      "var(--fg)",
        }}>G.G.</Link>

        {/* RIGHT */}
        <div style={{ display:"flex", gap:"32px", alignItems:"center", marginLeft:"auto" }}
             className="hide-mobile">
          <a href="https://www.instagram.com/giuligartner/"
             target="_blank" rel="noopener noreferrer"
             className="nav-link">Instagram</a>
          <a href="mailto:photo@giuligartner.com"
             className="nav-link">Email</a>
          <div style={{ marginLeft: "8px" }}>
            <ApertureDisplay />
          </div>
        </div>

        {/* MOBILE BUTTON */}
        <button
          className="show-mobile"
          onClick={() => setOpen((p) => !p)}
          aria-expanded={open}
          style={{
            background: "none", border: "none",
            fontFamily: "'Space Mono', monospace",
            fontSize:   "0.68rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--fg)",
            marginLeft: "auto",
          }}>
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {/* ── MOBILE OVERLAY ────────────────────────────────── */}
      <div style={{
        position:   "fixed", inset: 0, zIndex: 90,
        background: "var(--bg)",
        display:    "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        transition: "opacity 0.5s cubic-bezier(0.16,1,0.3,1)",
        opacity:    open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
      }}>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"40px" }}>
          {LINKS.map(({ to, label }) => (
            <Link key={to} to={to}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize:   "clamp(2.8rem,8vw,4.2rem)",
                color:      "var(--fg)",
                fontStyle:  "normal",
                transition: "font-style 0.25s ease",
                lineHeight: 1.1,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.fontStyle = "italic")}
              onMouseLeave={(e) => (e.currentTarget.style.fontStyle = "normal")}
            >{label}</Link>
          ))}
          <a href="https://www.instagram.com/giuligartner/"
             target="_blank" rel="noopener noreferrer"
             className="nav-link" style={{ marginTop: "12px" }}>Instagram</a>
          <a href="mailto:photo@giuligartner.com" className="nav-link">Email</a>
          <div style={{ marginTop: "8px" }}><ApertureDisplay /></div>
        </div>
      </div>

      {/* mobile helpers — injected once */}
      <style>{`
        @media(max-width:768px){
          .hide-mobile{display:none!important}
          .show-mobile{display:block!important}
        }
        @media(min-width:769px){
          .show-mobile{display:none!important}
        }
      `}</style>
    </>
  );
}