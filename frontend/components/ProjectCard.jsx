import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectCard({ project }) {
  const { title, slug, type, date, location, coverImageLeft, coverImageRight } = project;

  const containerRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const centerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    const center = centerRef.current;

    if (!container || !left || !right || !center) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 65%",
        end: "bottom 35%",
        scrub: 1.1,           // Smooth cinematic feel
        // pin: true,         // Uncomment if you want it to pin during scroll
      },
    });

    // Left image → slides LEFT + slight scale down + fade
    tl.to(left, {
      x: "-85%",
      scale: 0.92,
      opacity: 0.75,
      ease: "none",
    }, 0);

    // Right image → slides RIGHT + slight scale down + fade
    tl.to(right, {
      x: "85%",
      scale: 0.92,
      opacity: 0.75,
      ease: "none",
    }, 0);

    // Center panel → stays stable, fades in gently
    tl.fromTo(
      center,
      { opacity: 0, scale: 0.96, y: 30 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        ease: "power2.out",
      },
      0.1
    );

    return () => tl.kill();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        height: "680px",
        marginBottom: "clamp(100px, 12vw, 160px)",
        overflow: "hidden",
        borderRadius: "20px",
      }}
    >
      {/* LEFT IMAGE */}
      <div
        ref={leftRef}
        style={{
          position: "absolute",
          left: "0",
          top: "0",
          width: "52%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <img
          src={coverImageLeft}
          alt={title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderTopLeftRadius: "20px",
            borderBottomLeftRadius: "20px",
          }}
        />
      </div>

      {/* RIGHT IMAGE */}
      <div
        ref={rightRef}
        style={{
          position: "absolute",
          right: "0",
          top: "0",
          width: "52%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <img
          src={coverImageRight}
          alt={title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderTopRightRadius: "20px",
            borderBottomRightRadius: "20px",
          }}
        />
      </div>

      {/* CENTER CONTENT PANEL */}
      <div
        ref={centerRef}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "380px",
          background: "#0a0a0a",
          color: "#fff",
          padding: "52px 40px",
          textAlign: "center",
          borderRadius: "16px",
          zIndex: 10,
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          opacity: 0,
        }}
      >
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.72rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#999",
            marginBottom: "16px",
          }}
        >
          {date} → {location}
        </p>

        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.4rem, 4.2vw, 3.4rem)",
            fontWeight: 400,
            lineHeight: 1.05,
            marginBottom: "36px",
          }}
        >
          {title}
        </h2>

        <Link
          to={`/${type}/${slug}`}
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.68rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            border: "1px solid #fff",
            padding: "14px 32px",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "9999px",
            display: "inline-block",
            transition: "all 0.3s ease",
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
          SEE CASE STUDY
        </Link>
      </div>
    </div>
  );
}