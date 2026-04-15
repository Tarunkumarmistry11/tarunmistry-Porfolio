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
        end: "bottom 30%",
        scrub: 1.2,
      },
    });

    // Left image: moves left + subtle counterclockwise tilt
    tl.to(left, {
      x: "-72%",
      scale: 0.94,
      opacity: 0.78,
      rotation: -6,
      ease: "none",
    }, 0);

    // Right image: moves right + subtle clockwise tilt
    tl.to(right, {
      x: "72%",
      scale: 0.94,
      opacity: 0.78,
      rotation: 6,
      ease: "none",
    }, 0);

    // Center panel
    tl.fromTo(
      center,
      { opacity: 0, scale: 0.95, y: 40 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        ease: "power2.out",
      },
      0.15
    );

    return () => tl.kill();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        height: "720px",
        marginBottom: "clamp(100px, 12vw, 160px)",
        overflow: "visible",
        width: "100%",
        maxWidth: "1600px",
        marginLeft: "auto",
        marginRight: "auto",
        padding: "0 20px",
      }}
    >
      {/* LEFT IMAGE - Fully rounded corners */}
      <div
        ref={leftRef}
        style={{
          position: "absolute",
          left: "0",
          top: "0",
          width: "54%",
          height: "100%",
          overflow: "hidden",
          borderRadius: "28px",           // ← Uniform rounded corners on all sides
          transformOrigin: "center center",
        }}
      >
        <img
          src={coverImageLeft}
          alt={title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* RIGHT IMAGE - Fully rounded corners */}
      <div
        ref={rightRef}
        style={{
          position: "absolute",
          right: "0",
          top: "0",
          width: "54%",
          height: "100%",
          overflow: "hidden",
          borderRadius: "28px",           // ← Uniform rounded corners on all sides
          transformOrigin: "center center",
        }}
      >
        <img
          src={coverImageRight}
          alt={title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
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
          width: "400px",
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
          VISIT SHOP
        </Link>
      </div>
    </div>
  );
}