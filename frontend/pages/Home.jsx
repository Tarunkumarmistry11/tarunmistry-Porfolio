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

const fadeUp = {
  hidden:  { opacity: 0, y: 48 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
  },
};

const REEL =
  "https://cdn.prod.website-files.com/60db5e59f76ae577e9f50d42/63600c288b483e9c7398616b_reel-transcode.mp4";

const HERO_WORDS = ["Tarun", "Mistry", "photographer", "&", "filmmaker"];

export default function Home() {
  const dispatch = useDispatch();
  const { featured = [], loading, error } = useSelector((s) => s.projects);
  const { data: about }                   = useSelector((s) => s.about);
  const [reel, setReel]                   = useState(false);

  // Refs for GSAP
  const wordRefs  = useRef([]);
  const btnRef    = useRef(null);

  useEffect(() => {
    dispatch(getFeaturedProjects());
    dispatch(getAbout());
  }, [dispatch]);

  // ── GSAP hero clip reveal ──────────────────────────────────
  useEffect(() => {
    const words = wordRefs.current.filter(Boolean);
    const btn   = btnRef.current;
    if (!words.length) return;

    // Hide below clip boundary
    gsap.set(words, { yPercent: 110 });
    gsap.set(btn,   { autoAlpha: 0, y: 20 });

    const tl = gsap.timeline({ delay: 0.2 });

    tl.to(words, {
      yPercent: 0,
      duration: 1.2,
      ease: "power4.out",
      stagger: 0.1,
    })
    .to(btn, {
      autoAlpha: 1, y: 0,
      duration: 0.9,
      ease: "power3.out",
    }, "-=0.5");

    return () => tl.kill();
  }, []);

  // ── Reel modal ─────────────────────────────────────────────
  useEffect(() => {
    if (!reel) return;
    const fn = (e) => { if (e.key === "Escape") setReel(false); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", fn);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", fn);
    };
  }, [reel]);

  return (
    <div style={{ backgroundColor: "var(--bg)", color: "var(--fg)", minHeight: "100vh" }}>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "0 clamp(24px,5vw,80px) clamp(60px,8vh,100px)",
      }}>
        {/* Words */}
        <div style={{ paddingTop: "120px" }}>
          {HERO_WORDS.map((word, i) => (
            <div key={word} className="hero-line">
              <span
                ref={(el) => (wordRefs.current[i] = el)}
                className="hero-word"
                style={{
                  fontSize: "clamp(3.8rem, 11.5vw, 10.5rem)",
                }}
              >
                {word}
              </span>
            </div>
          ))}
        </div>

        {/* Play reel */}
        <button
          ref={btnRef}
          type="button"
          onClick={() => setReel(true)}
          style={{
            marginTop: "clamp(24px,4vh,48px)",
            background: "none", border: "none",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.68rem", letterSpacing: "0.14em",
            textTransform: "uppercase", color: "var(--fg)",
            display: "inline-flex", alignItems: "center", gap: "14px",
            visibility: "hidden",
          }}
        >
          <span
            style={{
              width: "42px", height: "42px", borderRadius: "50%",
              border: "1px solid var(--fg)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "14px",
              transition: "background 0.3s ease, color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--fg)";
              e.currentTarget.style.color = "var(--bg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--fg)";
            }}
          >▶</span>
          play my reel
        </button>
      </section>

      {/* ── REEL MODAL ────────────────────────────────────── */}
      {reel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setReel(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            backgroundColor: "rgba(10,10,10,0.96)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <video
            src={REEL} autoPlay controls
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "88vw", maxHeight: "82vh" }}
          />
          <button
            onClick={() => setReel(false)}
            style={{
              position: "absolute", top: "28px", right: "36px",
              background: "none", border: "none",
              color: "#f0ebe4", fontFamily: "'Space Mono', monospace",
              fontSize: "0.68rem", letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >Close</button>
        </motion.div>
      )}

      {/* ── MARQUEE ───────────────────────────────────────── */}
      {about?.photos?.length > 0 && (
        <motion.div
          initial="hidden" whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          style={{ padding: "20px 0", overflow: "hidden" }}
        >
          <MarqueeStrip images={about.photos} />
        </motion.div>
      )}

      {/* ── ABOUT SNIPPET ─────────────────────────────────── */}
      {about && (
        <motion.section
          initial="hidden" whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          style={{
            padding: "clamp(48px,7vw,96px) clamp(24px,5vw,80px)",
            maxWidth: "1100px", margin: "0 auto",
          }}
        >
          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.65rem", letterSpacing: "0.16em",
            textTransform: "uppercase", color: "var(--warm)",
            marginBottom: "16px",
          }}>
            A tiny mountain village where it all began...
          </p>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.1rem, 2.2vw, 1.5rem)",
            lineHeight: 1.8, color: "var(--fg-60)",
            maxWidth: "640px",
          }}>
            {about.bio?.split("\n")[0]}
          </p>
        </motion.section>
      )}

      {/* ── PROJECTS ──────────────────────────────────────── */}
      <section style={{
        padding: "0 clamp(24px,5vw,80px) clamp(80px,10vw,140px)",
        maxWidth: "1100px", margin: "0 auto",
      }}>
        {loading && (
          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.68rem", color: "var(--fg-40)",
          }}>Loading...</p>
        )}
        {error && (
          <p style={{ color: "red", fontSize: "0.85rem" }}>
            Failed to load projects
          </p>
        )}
        {!loading && featured.map((project, i) => (
          <ProjectCard key={project._id} project={project} index={i} />
        ))}
      </section>
    </div>
  );
}