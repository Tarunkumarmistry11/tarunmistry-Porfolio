import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import ApertureDisplay from "./ApertureDisplay";

const NAV_LINKS = [
  { to: "/stills", label: "Stills" },
  { to: "/motion", label: "Motion" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navRef = useRef(null);
  const overlayRef = useRef(null);
  const bigLinksRef = useRef([]);
  const tlRef = useRef(null);
  const mountedRef = useRef(false);

  const location = useLocation();

  // Navbar entrance
  useEffect(() => {
    if (!navRef.current) return;
    gsap.fromTo(
      navRef.current,
      { opacity: 0, y: -18 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 1.1 }
    );
  }, []);

  // Build GSAP timeline once
  useEffect(() => {
    if (mountedRef.current) return;

    const timer = setTimeout(() => {
      const overlay = overlayRef.current;
      const bigLinks = bigLinksRef.current.filter(Boolean);

      if (!overlay || bigLinks.length === 0) return;

      gsap.set(overlay, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(bigLinks, { y: 44, opacity: 0 });

      const tl = gsap.timeline({ paused: true });

      tl.to(overlay, {
        autoAlpha: 1,
        pointerEvents: "auto",
        duration: 0.4,
        ease: "power2.out",
      }).to(
        bigLinks,
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          ease: "power4.out",
          stagger: 0.1,
        },
        "-=0.1"
      );

      tlRef.current = tl;
      mountedRef.current = true;
    }, 120);

    return () => clearTimeout(timer);
  }, []);

  // Play / reverse animation
  useEffect(() => {
    if (!tlRef.current) return;
    open ? tlRef.current.play() : tlRef.current.reverse();
  }, [open]);

  // Scroll detection
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close on route change
  const closeMenu = useCallback(() => setOpen(false), []);
  useEffect(() => {
    closeMenu();
  }, [location.pathname, closeMenu]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  // ESC key
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <style>{`
        .nav-desktop { display: flex !important; }
        .nav-mobile { display: none !important; }

        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile { display: flex !important; }
        }

        .nav-link {
          font-family: 'Space Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--fg);
          text-decoration: none;
          position: relative;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background: var(--fg);
          transition: width 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .nav-link:hover::after { width: 100%; }
      `}</style>

      {/* Main Navbar */}
      <nav
        ref={navRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          padding: "22px clamp(20px, 5vw, 60px)",
          opacity: 0,
          transition: "background 0.4s ease, backdrop-filter 0.4s ease",
          background: scrolled ? "var(--nav-bg)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        {/* Desktop Left */}
        <div className="nav-desktop" style={{ alignItems: "center", gap: "36px" }}>
          {NAV_LINKS.map(({ to, label }) => (
            <Link key={to} to={to} className="nav-link">
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop Center Logo */}
        <Link
          to="/"
          className="nav-desktop"
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "'Playfair Display', serif",
            fontSize: "0.95rem",
            letterSpacing: "0.06em",
            color: "var(--fg)",
          }}
        >
          G.G.
        </Link>

        {/* Desktop Right */}
        <div
          className="nav-desktop"
          style={{ alignItems: "center", gap: "32px", marginLeft: "auto" }}
        >
          <a
            href="https://www.instagram.com/giuligartner/"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
            Instagram
          </a>
          <a href="mailto:photo@giuligartner.com" className="nav-link">
            Email
          </a>
          <ApertureDisplay />
        </div>

        {/* Mobile Header */}
        <div
          className="nav-mobile"
          style={{
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link
            to="/"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.1rem",
              color: "var(--fg)",
              letterSpacing: "0.04em",
              textDecoration: "none",
            }}
          >
            G.G.
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <ApertureDisplay />
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((p) => !p)}
              style={{
                background: "none",
                border: "none",
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.68rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--fg)",
                cursor: "pointer",
                padding: 0,
              }}
            >
              {open ? "CLOSE" : "MENU"}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Fullscreen Overlay */}
      <div
        ref={overlayRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 90,
          backgroundColor: "var(--bg)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(40px, 8vh, 80px) 20px",
          visibility: "hidden",
          opacity: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "clamp(28px, 6vh, 48px)",
            textAlign: "center",
          }}
        >
          {NAV_LINKS.map(({ to, label }, index) => (
            <Link
              key={to}
              to={to}
              ref={(el) => (bigLinksRef.current[index] = el)}
              onClick={() => setOpen(false)}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.8rem, 11vw, 4.8rem)",
                fontWeight: 400,
                color: "var(--fg)",
                lineHeight: 1.05,
                textDecoration: "none",
                opacity: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.fontStyle = "italic")}
              onMouseLeave={(e) => (e.currentTarget.style.fontStyle = "normal")}
            >
              {label}
            </Link>
          ))}

          {/* Instagram & Email - Now using same large serif font */}
          <a
            href="https://www.instagram.com/giuligartner/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.8rem, 11vw, 4.8rem)",
              fontWeight: 400,
              color: "var(--fg)",
              lineHeight: 1.05,
              textDecoration: "none",
              opacity: 0,
              marginTop: "12px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.fontStyle = "italic")}
            onMouseLeave={(e) => (e.currentTarget.style.fontStyle = "normal")}
          >
            Instagram
          </a>

          <a
            href="mailto:photo@giuligartner.com"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.8rem, 11vw, 4.8rem)",
              fontWeight: 400,
              color: "var(--fg)",
              lineHeight: 1.05,
              textDecoration: "none",
              opacity: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.fontStyle = "italic")}
            onMouseLeave={(e) => (e.currentTarget.style.fontStyle = "normal")}
          >
            Email
          </a>
        </div>
      </div>
    </>
  );
}