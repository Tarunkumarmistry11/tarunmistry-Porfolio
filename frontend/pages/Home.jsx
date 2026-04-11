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

  // Reel modal ESC + scroll lock
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
    <div style={{ background: "var(--bg)", color: "var(--fg)", minHeight: "100vh" }}>
      {/* HERO SECTION - VIDEO BACKGROUND with space from Navbar */}
      <section
        style={{
          position: "relative",
          height: "100vh",
          minHeight: "100vh",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "90px",           // ← Added space from fixed Navbar
        }}
      >
        {/* Background Video */}
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

        {/* Dark Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0, 0, 0, 0.45)",
            zIndex: 1,
          }}
        />

        {/* Hero Text - On top of video */}
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

      {/* ABOUT SNIPPET */}
      {about && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={FU}
          style={{
            padding: "clamp(48px,7vw,96px) clamp(20px,5vw,80px)",
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.62rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--warm)",
              marginBottom: "16px",
            }}
          >
            A tiny mountain village where it all began...
          </p>
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.05rem, 2.2vw, 1.45rem)",
              lineHeight: 1.82,
              color: "var(--fg60)",
              maxWidth: "620px",
            }}
          >
            {about.bio?.split("\n")[0]}
          </p>
        </motion.section>
      )}

      {/* PROJECTS SECTION */}
      <section
        style={{
          padding: "0 clamp(20px,5vw,80px) clamp(80px,10vw,140px)",
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