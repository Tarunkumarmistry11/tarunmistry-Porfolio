import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getFeaturedProjects } from "../features/projects/projectsSlice";
import { getAbout } from "../features/about/aboutSlice";
import ProjectCard from "../components/ProjectCard";
import MarqueeStrip from "../components/MarqueeStrip";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const dispatch = useDispatch();
  const { featured = [], loading: projLoading, error: projError } =
    useSelector((s) => s.projects);
  const { data: about } = useSelector((s) => s.about);
  const [reelVisible, setReelVisible] = useState(false);

  // Refs
  const heroRef     = useRef(null);
  const wordsRef    = useRef([]);
  const reelBtnRef  = useRef(null);
  const aboutRef    = useRef(null);
  const marqueeRef  = useRef(null);
  const projectsRef = useRef(null);

  const REEL_URL =
    "https://cdn.prod.website-files.com/60db5e59f76ae577e9f50d42/63600c288b483e9c7398616b_reel-transcode.mp4";

  const heroText = ["Giulia", "Gartner", "photographer", "&", "filmmaker"];

  // ── Fetch data ───────────────────────────────────────────
  useEffect(() => {
    dispatch(getFeaturedProjects());
    dispatch(getAbout());
  }, [dispatch]);

  // ── GSAP Hero animation ──────────────────────────────────
  useEffect(() => {
    const words = wordsRef.current.filter(Boolean);
    const btn   = reelBtnRef.current;
    if (!words.length) return;

    // Set initial state
    gsap.set(words, { yPercent: 110, opacity: 0 });
    gsap.set(btn,   { opacity: 0, y: 20 });

    // Staggered reveal
    const tl = gsap.timeline({ delay: 0.2 });

    tl.to(words, {
      yPercent: 0,
      opacity: 1,
      duration: 1.1,
      ease: "power4.out",
      stagger: 0.08,
    }).to(
      btn,
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      "-=0.4"
    );

    return () => tl.kill();
  }, []);

  // ── GSAP Scroll reveals ──────────────────────────────────
  useEffect(() => {
    const sections = [aboutRef.current, marqueeRef.current, projectsRef.current].filter(Boolean);

    sections.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        }
      );
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [about, featured]);

  // ── Reel modal ESC + scroll lock ────────────────────────
  useEffect(() => {
    if (!reelVisible) return;
    const handleKey = (e) => { if (e.key === "Escape") setReelVisible(false); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [reelVisible]);

  return (
    <main className="page-root">

      {/* ── HERO ────────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "8rem 2.5rem 5rem",
          overflow: "hidden",
        }}
      >
        {/* Words */}
        <div>
          {heroText.map((word, i) => (
            <div key={word} className="hero-line">
              <span
                ref={(el) => (wordsRef.current[i] = el)}
                className="hero-word"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(3rem, 10vw, 8.5rem)",
                  lineHeight: 0.92,
                  letterSpacing: "-0.02em",
                  color: "var(--fg)",
                }}
              >
                {word}
              </span>
            </div>
          ))}
        </div>

        {/* Play reel button */}
        <button
          ref={reelBtnRef}
          type="button"
          onClick={() => setReelVisible(true)}
          style={{
            marginTop: "2.5rem",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.72rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--fg)",
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            opacity: 0,
          }}
        >
          <span
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "1px solid var(--fg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              transition: "background 0.3s, color 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--fg)";
              e.currentTarget.style.color = "var(--bg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--fg)";
            }}
          >
            ▶
          </span>
          play my reel
        </button>
      </section>

      {/* ── REEL MODAL ──────────────────────────────────── */}
      {reelVisible && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setReelVisible(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            backgroundColor: "rgba(26,26,26,0.96)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <video
            src={REEL_URL}
            autoPlay
            controls
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "85vw", maxHeight: "80vh" }}
          />
          <button
            onClick={() => setReelVisible(false)}
            style={{
              position: "absolute",
              top: "2rem",
              right: "2rem",
              color: "#f5f0eb",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Close
          </button>
        </div>
      )}

      {/* ── MARQUEE ─────────────────────────────────────── */}
      {about?.photos?.length > 0 && (
        <div ref={marqueeRef} style={{ padding: "24px 0", overflow: "hidden", opacity: 0 }}>
          <MarqueeStrip images={about.photos} />
        </div>
      )}

      {/* ── ABOUT SNIPPET ───────────────────────────────── */}
      {about && (
        <section
          ref={aboutRef}
          className="gsap-reveal"
          style={{
            padding: "4rem 2.5rem",
            maxWidth: "72rem",
            margin: "0 auto",
            opacity: 0,
          }}
        >
          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.68rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--warm)",
            marginBottom: "12px",
          }}>
            A tiny mountain village where it all began...
          </p>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.1rem, 2vw, 1.35rem)",
            lineHeight: 1.75,
            color: "var(--fg-muted)",
            maxWidth: "600px",
          }}>
            {about.bio?.split("\n")[0]}
          </p>
        </section>
      )}

      {/* ── FEATURED PROJECTS ───────────────────────────── */}
      <section
        ref={projectsRef}
        className="gsap-reveal"
        style={{
          padding: "2rem 2.5rem 6rem",
          maxWidth: "72rem",
          margin: "0 auto",
          opacity: 0,
        }}
      >
        {projLoading ? (
          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.72rem",
            color: "var(--fg-muted)",
          }}>
            Loading...
          </p>
        ) : projError ? (
          <p style={{ color: "red", fontSize: "0.875rem" }}>
            Failed to load projects
          </p>
        ) : (
          featured.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))
        )}
      </section>
    </main>
  );
}