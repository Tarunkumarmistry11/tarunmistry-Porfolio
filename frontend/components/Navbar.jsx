import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const INSTAGRAM_URL = "https://www.instagram.com/giuligartner/";
  const EMAIL = "photo@giuligartner.com";

  /**
   * Scroll Effect
   */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /**
   * Close menu on ESC key
   */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  /**
   * Prevent background scroll when menu is open
   */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  /**
   * Handle navigation click (FIXED)
   */
  const handleNavClick = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-cream/90 backdrop-blur-sm" : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-10 py-5">
          
          {/* Desktop Left */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/stills" onClick={handleNavClick} className="nav-link">
              Stills
            </Link>
            <Link to="/motion" onClick={handleNavClick} className="nav-link">
              Motion
            </Link>
            <Link to="/about" onClick={handleNavClick} className="nav-link">
              About
            </Link>
          </div>

          {/* Center Logo */}
          <Link
            to="/"
            onClick={handleNavClick}
            className="absolute left-1/2 -translate-x-1/2 font-serif text-sm tracking-wider hidden md:block"
          >
            G.G.
          </Link>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-8 ml-auto">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
            >
              Instagram
            </a>

            <a href={`mailto:${EMAIL}`} className="nav-link">
              Email
            </a>

            <div className="flex flex-col items-center font-mono text-[9px] leading-tight ml-4">
              <span>F/24</span>
              <span className="text-warm">F/1.4</span>
            </div>
          </div>

          {/* Mobile Button */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="md:hidden font-mono text-xs tracking-widest uppercase z-50 relative"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 z-40 bg-cream flex flex-col items-center justify-center transition-all duration-500 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center gap-10">
          {[
            { to: "/stills", label: "Stills" },
            { to: "/motion", label: "Motion" },
            { to: "/about", label: "About" },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={handleNavClick} // ✅ FIX HERE
              className="font-serif text-5xl hover:italic transition-all duration-300"
            >
              {label}
            </Link>
          ))}

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link mt-6"
          >
            Instagram
          </a>

          <a href={`mailto:${EMAIL}`} className="nav-link">
            Email
          </a>
        </div>
      </div>
    </>
  );
}