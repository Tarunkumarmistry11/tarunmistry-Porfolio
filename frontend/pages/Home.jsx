import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { getFeaturedProjects } from "../features/projects/projectsSlice";
import { getAbout } from "../features/about/aboutSlice";
import ProjectCard from "../components/ProjectCard";
import MarqueeStrip from "../components/MarqueeStrip";

gsap.registerPlugin(ScrollTrigger);

const REEL =
  "https://cdn.prod.website-files.com/60db5e59f76ae577e9f50d42/63600c288b483e9c7398616b_reel-transcode.mp4";

const HERO_WORDS = ["TARUN", "MISTRY", "PHOTOGRAPHER", "&", "FILMMAKER"];

const FU = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Home() {
  const dispatch = useDispatch();
  const { featured = [], loading, error } = useSelector((s) => s.projects);
  const { data: about } = useSelector((s) => s.about);

  const [reel, setReel] = useState(false);
  const wRefs = useRef([]);

  useEffect(() => {
    dispatch(getFeaturedProjects());
    dispatch(getAbout());
  }, [dispatch]);

  // Hero text animation
  useEffect(() => {
    const words = wRefs.current.filter(Boolean);
    if (!words.length) return;

    gsap.set(words, { yPercent: 110 });

    const tl = gsap.timeline({ delay: 0.3 });
    tl.to(words, {
      yPercent: 0,
      duration: 1.3,
      ease: "power4.out",
      stagger: 0.085,
    });

    return () => tl.kill();
  }, []);

  // Reel modal
  useEffect(() => {
    if (!reel) return;
    const fn = (e) => {
      if (e.key === "Escape") setReel(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", fn);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", fn);
    };
  }, [reel]);

  return (
    <div
      style={{
        background: "var(--bg)",
        color: "var(--fg)",
        minHeight: "100vh",
      }}
    >
      {/* HERO SECTION - VIDEO BACKGROUND */}
      <section
        style={{
          position: "relative",
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "90px",
        }}
      >
        <video
          src={REEL}
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0, 0, 0, 0.45)",
            zIndex: 1,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            padding: "0 20px",
            maxWidth: "1100px",
          }}
        >
          {HERO_WORDS.map((word, i) => (
            <div
              key={i}
              style={{
                overflow: "hidden",
                marginBottom: word === "&" ? "0.08em" : "0.04em",
              }}
            >
              <span
                ref={(el) => (wRefs.current[i] = el)}
                style={{
                  display: "block",
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 400,
                  fontSize: "clamp(3.2rem, 8.5vw, 7.8rem)",
                  lineHeight: 0.92,
                  letterSpacing: "-0.03em",
                  color: "#f5f0eb",
                  textShadow: "0 4px 40px rgba(0,0,0,0.6)",
                  whiteSpace: "nowrap",
                }}
              >
                {word}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* REEL MODAL */}
      {reel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setReel(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 300,
            backgroundColor: "rgba(8,8,8,0.98)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <video
            src={REEL}
            autoPlay
            controls
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "90vw", maxHeight: "85vh", borderRadius: "4px" }}
          />
          <button
            onClick={() => setReel(false)}
            style={{
              position: "absolute",
              top: "32px",
              right: "40px",
              background: "none",
              border: "none",
              color: "#f0ebe4",
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.68rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            CLOSE
          </button>
        </motion.div>
      )}

      {/* DOLOMITES SECTION */}
      <DolomitesSection />

      {/* MARQUEE */}
      {about?.photos?.length > 0 && (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={FU}
          style={{ padding: "20px 0" }}
        >
          <MarqueeStrip images={about.photos} />
        </motion.div>
      )}

      {/* PROJECTS SECTION */}
      <section
        style={{
          padding:
            "clamp(40px, 6vw, 80px) clamp(20px, 5vw, 80px) clamp(80px, 10vw, 140px)",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {loading && <p>Loading projects...</p>}
        {error && <p style={{ color: "red" }}>Failed to load projects</p>}

        {!loading &&
          featured.map((project, i) => (
            <ProjectCard key={project._id} project={project} index={i} />
          ))}
      </section>
    </div>
  );
}

// ── DOLOMITES SECTION ──────────────────────────────────────
function DolomitesSection() {
  return (
    <section
      style={{
        background: "var(--bg)",
        color: "var(--fg)",
        padding: "clamp(100px, 12vh, 160px) clamp(20px, 5vw, 60px)",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "940px", margin: "0 auto", padding: "0 20px" }}>
        {/* Large flowing text with inline images */}
        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.4rem, 6.5vw, 5.8rem)",
            lineHeight: 1.08,
            fontWeight: 400,
            marginBottom: "clamp(40px, 7vh, 80px)",
          }}
        >
          A{" "}
          <InlineImage
            src="https://cdn.prod.website-files.com/60db5e59f76ae577e9f50d42/61e939dee9c133675fbab858_Photo%20-%20Dolomites%20-%201.jpg"
            tilt="left"
          />{" "}
          small group of islands{" "}
          <InlineImage
            src="https://cdn.prod.website-files.com/60db5e59f76ae577e9f50d42/61e939de8821f377935af4c3_Photo%20-%20Dolomites%20-%202.jpg"
            tilt="right"
          />{" "}
          where it all began...
          <InlineImage
            src="https://cdn.prod.website-files.com/60db5e59f76ae577e9f50d42/61e939de360c7c91700e9743_Photo%20-%20Dolomites%20-%203.jpg"
            tilt="left"
          />
        </div>

        {/* Bio text */}
        <p
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1rem, 1.8vw, 1.15rem)",
            lineHeight: 1.85,
            color: "var(--fg)",
            maxWidth: "680px",
            margin: "0 auto 60px",
          }}
        >
          Tarun Mistry is a cinematic photographer, filmmaker, and visual
          storyteller based in the Andaman Islands. His work captures moments
          that feel like memories, blending deep tones, dreamy colors, and raw
          emotion. From quiet frames to powerful landscapes, he crafts visuals
          that don’t just show a place, but make you feel it.
        </p>

        {/* Premium READ MY STORY Button with GSAP Hover Effect */}
        <ReadMyStoryButton />
      </div>
    </section>
  );
}

// ── Premium READ MY STORY Button ─────────────────────────────
function ReadMyStoryButton() {
  const btnRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    const btn = btnRef.current;
    const bg = bgRef.current;
    if (!btn || !bg) return;

    const hoverTl = gsap.timeline({ paused: true });

    hoverTl
      .to(bg, {
        scale: 1,
        duration: 0.65,
        ease: "power3.out",
      })
      .to(btn, {
        y: -3,
        duration: 0.4,
        ease: "power2.out",
      }, "-=0.5");

    const handleMouseEnter = () => {
      hoverTl.play();
      btn.style.color = "var(--bg)";
    };

    const handleMouseLeave = () => {
      hoverTl.reverse();
      btn.style.color = "var(--fg)";
    };

    btn.addEventListener("mouseenter", handleMouseEnter);
    btn.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      btn.removeEventListener("mouseenter", handleMouseEnter);
      btn.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <a
      ref={btnRef}
      href="/about"
      style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: "0.68rem",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "var(--fg)",
        border: "1px solid var(--fg)",
        backgroundColor: "transparent",
        padding: "14px 38px",
        borderRadius: "9999px",
        textDecoration: "none",
        display: "inline-block",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      {/* Expanding Background Layer */}
      <div
        ref={bgRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "var(--fg)",
          borderRadius: "9999px",
          transform: "scale(0)",
          transformOrigin: "center",
          zIndex: -1,
        }}
      />

      {/* Button Text */}
      <span style={{ position: "relative", zIndex: 2 }}>
        READ MY STORY
      </span>
    </a>
  );
}

// ── INLINE IMAGE COMPONENT ─────────────────────────────────
function InlineImage({ src, tilt }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { opacity: 0.3, scale: 0.85, y: 15 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
      },
    );
  }, []);

  const handleMouseEnter = () => {
    const rotation = tilt === "left" ? -12 : 12;
    gsap.to(ref.current, {
      scale: 1.8,
      rotation: rotation,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(ref.current, {
      scale: 1,
      rotation: 0,
      duration: 0.45,
      ease: "power2.out",
    });
  };

  return (
    <img
      ref={ref}
      src={src}
      alt=""
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        width: "clamp(52px, 7vw, 78px)",
        height: "clamp(52px, 7vw, 78px)",
        objectFit: "cover",
        borderRadius: "10px",
        margin: "0 8px",
        cursor: "pointer",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
}