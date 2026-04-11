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
    <div style={{ background: "var(--bg)", color: "var(--fg)", minHeight: "100vh" }}>
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
              style={{ overflow: "hidden", marginBottom: word === "&" ? "0.08em" : "0.04em" }}
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

      {/* DOLOMITES SECTION - Large text with inline images */}
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
          padding: "clamp(40px,6vw,80px) clamp(20px,5vw,80px) clamp(80px,10vw,140px)",
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
        background: "#0a0a0a",
        color: "#fff",
        padding: "clamp(100px, 12vh, 160px) clamp(20px, 5vw, 60px)",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "940px", margin: "0 auto" }}>
        {/* Large text with inline images */}
        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.8rem, 7.5vw, 6.2rem)",
            lineHeight: 1.05,
            fontWeight: 400,
            marginBottom: "clamp(40px, 7vh, 80px)",
          }}
        >
          A{" "}
          <InlineImage 
            src="https://cdn.prod.website-files.com/60db5e59f76ae577e9f50d42/61e939dee9c133675fbab858_Photo%20-%20Dolomites%20-%201.jpg" 
            tilt="left" 
          />
          {" "}tiny mountain village{" "}
          <InlineImage 
            src="https://cdn.prod.website-files.com/60db5e59f76ae577e9f50d42/61e939de8821f377935af4c3_Photo%20-%20Dolomites%20-%202.jpg" 
            tilt="right" 
          />
          {" "}where it all began...
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
            color: "#ddd",
            maxWidth: "680px",
            margin: "0 auto 60px",
          }}
        >
          Tarun Mistry (@giuligartner) is an outdoor, travel, and commercial photographer,
          filmmaker, and storyteller from the Dolomites in northern Italy. His work focuses on
          capturing wild and rugged landscapes with a vivid color palette and dreamy elements.
          His love for photography has spilled over into filmmaking which is one of the main
          creative outlets he pursues today.
        </p>

        {/* READ MY STORY Button */}
        <a
          href="/about"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.68rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#fff",
            border: "1px solid #fff",
            padding: "14px 36px",
            borderRadius: "9999px",
            textDecoration: "none",
            display: "inline-block",
            transition: "all 0.35s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#fff";
            e.currentTarget.style.color = "#000";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#fff";
          }}
        >
          READ MY STORY
        </a>
      </div>
    </section>
  );
}

function InlineImage({ src, tilt }) {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Scroll reveal
    gsap.fromTo(
      el,
      { opacity: 0, scale: 0.7, y: 20 },
      {
        opacity: 1,
        scale: 1,
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
  }, []);

  // Hover animation with tilt
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (isHovered) {
      const rotation = tilt === "left" ? -12 : 12;
      gsap.to(el, {
        scale: 1.18,
        rotation: rotation,
        duration: 0.6,
        ease: "power2.out",
      });
    } else {
      gsap.to(el, {
        scale: 1,
        rotation: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [isHovered, tilt]);

  return (
    <img
      ref={ref}
      src={src}
      alt=""
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        width: "clamp(58px, 7vw, 82px)",
        height: "clamp(58px, 7vw, 82px)",
        objectFit: "cover",
        borderRadius: "8px",
        margin: "0 10px",
        boxShadow: "0 6px 25px rgba(0,0,0,0.5)",
        cursor: "pointer",
        transition: "box-shadow 0.3s ease",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    />
  );
}