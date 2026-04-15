import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { getAbout } from "../features/about/aboutSlice";

gsap.registerPlugin(ScrollTrigger);

/* -------------------- DATA -------------------- */

const QUOTE =
  "We are a product of our environment, probably more than we'd care to admit. Growing up in a small village by the mountains shaped my relationship with nature.";

const PHOTO_STRIP = [
  "https://cdn.prod.website-files.com/60db5e59f76ae577e9f50d42/635e509877408d75da804c25_Parker%20Scmidt-205.jpg",
  "https://cdn.prod.website-files.com/60db5e59f76ae577e9f50d42/61f7f6a452675ad591cfd1a8_photo-creative-6.jpg",
  "https://cdn.prod.website-files.com/60db5e59f76ae577e9f50d42/61f7f6a498d63ab45b056cb8_photo-creative-3.jpg",
  "https://cdn.prod.website-files.com/60db5e59f76ae577e9f50d42/635e4fddb16556675ceb906f_97660031.jpg",
  "https://cdn.prod.website-files.com/60db5e59f76ae577e9f50d42/61f7f6a3627fccd34acd48ef_photo-creative-2.jpg",
  "https://cdn.prod.website-files.com/60db5e59f76ae577e9f50d42/61f7f6a45b40c6821923f5cd_photo-creative-7.jpg",
];

const PORTRAIT =
  "https://cdn.prod.website-files.com/60db5e59f76ae577e9f50d42/63769165d4de2442394ed214_giulia-cold.jpg";

/* -------------------- COMPONENT -------------------- */

export default function About() {
  const dispatch = useDispatch();
  const { data: about } = useSelector((s) => s.about);

  const quoteRef = useRef(null);
  const stripRef = useRef(null);

  // Cinematic section refs
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const imgRef = useRef(null);

  /* -------------------- INIT -------------------- */

  useEffect(() => {
    dispatch(getAbout());
  }, [dispatch]);

  // ✅ LENIS + GSAP SYNC
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      ScrollTrigger.update();
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  /* -------------------- ANIMATIONS -------------------- */

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Quote fade
      gsap.fromTo(
        quoteRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: quoteRef.current,
            start: "top 80%",
          },
        }
      );

      // Horizontal scroll strip
      gsap.to(stripRef.current, {
        xPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: stripRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // TEXT STAGGER
      const lines = textRef.current.querySelectorAll("p");

      gsap.fromTo(
        lines,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );

      // IMAGE PARALLAX (🔥 KEY EFFECT)
      gsap.fromTo(
        imgRef.current,
        { y: 100, scale: 1.1 },
        {
          y: -60,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  /* -------------------- DATA -------------------- */

  const bio =
    about?.bio?.split("\n").filter(Boolean) || [
      "The unique culture and mountains shaped my creative journey.",
      "Photography became my way of expressing emotions.",
      "Every frame I capture tells a story.",
    ];

  /* -------------------- UI -------------------- */

  return (
    <div
      style={{
        background: "#0a0a0a",
        color: "#fff",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      {/* QUOTE */}
      <section
        style={{
          padding: "clamp(80px, 12vh, 160px) 20px",
          textAlign: "center",
        }}
      >
        <p
          ref={quoteRef}
          style={{
            fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
            maxWidth: "800px",
            margin: "0 auto",
            lineHeight: 1.5,
          }}
        >
          {QUOTE}
        </p>
      </section>

      {/* PHOTO STRIP */}
      <div
        style={{
          overflow: "hidden",
          padding: "20px 0 60px",
        }}
      >
        <div
          ref={stripRef}
          style={{
            display: "flex",
            gap: "12px",
            width: "max-content",
          }}
        >
          {[...PHOTO_STRIP, ...PHOTO_STRIP].map((src, i) => (
            <div
              key={i}
              style={{
                width: "280px",
                height: "360px",
                borderRadius: "16px",
                overflow: "hidden",
              }}
            >
              <img
                src={src}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* CINEMATIC BIO (🔥 MAIN SECTION) */}
      <section
        ref={sectionRef}
        style={{
          padding: "120px 20px",
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "80px",
          alignItems: "center",
        }}
      >
        {/* IMAGE */}
        <div
          ref={imgRef}
          style={{
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >
          <img
            src={PORTRAIT}
            alt=""
            style={{ width: "100%", display: "block" }}
          />
        </div>

        {/* TEXT */}
        <div ref={textRef}>
          {bio.map((p, i) => (
            <p key={i} style={{ marginBottom: "1.6em", lineHeight: 1.8 }}>
              {p}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}