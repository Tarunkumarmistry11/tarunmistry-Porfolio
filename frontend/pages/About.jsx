import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getAbout } from "../features/about/aboutSlice";

gsap.registerPlugin(ScrollTrigger);

const QUOTE =
  "We are a product of our environment, probably more than we'd care to admit. Growing up in a small island in the middle of the ocean  helped me shape a profound yet playful relationship with nature....";

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

export default function About() {
  const dispatch = useDispatch();
  const { data: about } = useSelector((s) => s.about);

  const quoteRef = useRef(null);
  const stripRef = useRef(null);
  const createSectionRef = useRef(null);
  const bioTextRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    dispatch(getAbout());
  }, [dispatch]);

  /* -------------------- ANIMATIONS -------------------- */
  useEffect(() => {
    // Small delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // ── IMPROVED Cinematic Quote Reveal ──
        if (quoteRef.current) {
          const words = quoteRef.current.querySelectorAll("span");

          gsap.set(words, {
            opacity: 0.08,
            y: 45,
            filter: "blur(4px)",
          });

          gsap.to(words, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.4,
            ease: "power3.out",
            stagger: 0.045,
            scrollTrigger: {
              trigger: quoteRef.current,
              start: "top 82%",
              end: "bottom 45%",
              scrub: 2.2, // Very smooth & cinematic
              once: false,
            },
          });
        }

        // Horizontal photo strip
        if (stripRef.current) {
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
        }

        // Bio text progressive reveal
        if (bioTextRef.current) {
          const paragraphs = bioTextRef.current.querySelectorAll("p");
          gsap.fromTo(
            paragraphs,
            { opacity: 0.15, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 1.4,
              ease: "power3.out",
              stagger: 0.25,
              scrollTrigger: {
                trigger: createSectionRef.current,
                start: "top 70%",
                end: "bottom 40%",
                scrub: 1.5,
              },
            },
          );
        }

        // Image Parallax
        if (imgRef.current) {
          const isMobile = window.innerWidth < 768;
          gsap.fromTo(
            imgRef.current,
            { y: isMobile ? 40 : 100, scale: 1.08 },
            {
              y: isMobile ? -20 : -60,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: createSectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        }
      });

      return () => ctx.revert();
    }, 100); // Small delay ensures refs are populated

    return () => clearTimeout(timer);
  }, []);

  /* -------------------- Split Quote into Words -------------------- */
  const splitQuote = (text) => {
    return text.split(" ").map((word, i) => (
      <span
        key={i}
        style={{
          display: "inline-block",
          marginRight: "0.42em",
          fontFamily: "'Playfair Display', serif",
        }}
      >
        {word}
      </span>
    ));
  };

  return (
    <div
      style={{
        background: "var(--bg)",
        color: "var(--fg)",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      {/* QUOTE SECTION - Strong Cinematic Reveal */}
      <section
        style={{
          padding: "clamp(120px, 18vh, 200px) 20px",
          textAlign: "center",
        }}
      >
        <p
          ref={quoteRef}
          style={{
            fontSize: "clamp(1.65rem, 3.5vw, 2.2rem)", // Nicely larger
            maxWidth: "860px",
            margin: "0 auto",
            lineHeight: 1.42,
            color: "var(--fg)",
            fontFamily: "'Playfair Display', serif",
          }}
        >
          {splitQuote(QUOTE)}
        </p>
      </section>

      {/* Photo Strip */}
      <div
        style={{
          overflow: "hidden",
          padding: "40px 20px 80px",
        }}
      >
        <div
          ref={stripRef}
          style={{
            display: "flex",
            gap: "16px",
            width: "max-content",
          }}
        >
          {[...PHOTO_STRIP, ...PHOTO_STRIP].map((src, i) => (
            <div
              key={i}
              style={{
                width: "clamp(180px, 28vw, 320px)",
                height: "clamp(240px, 38vw, 420px)",
                flexShrink: 0,
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              }}
            >
              <img
                src={src}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* "Let's create beautiful things" Section */}
      <section
        ref={createSectionRef}
        style={{
          padding: "clamp(100px, 14vh, 160px) 20px",
          background: "var(--bg)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(60px, 8vw, 100px)",
          alignItems: "center",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
        className="create-section"
      >
        <div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(3.2rem, 8vw, 5.4rem)",
              lineHeight: 1.05,
              fontWeight: 400,
              color: "var(--fg)",
              marginBottom: "clamp(40px, 6vw, 60px)",
            }}
          >
            Let's create
            <br />
            beautiful things.
          </h2>

          <div
            style={{
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
            }}
          >
            <img
              src={PORTRAIT}
              alt="Giulia Gartner"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />
          </div>
        </div>

        <div ref={bioTextRef}>
          <p
            style={{
              marginBottom: "1.8em",
              fontFamily: "'Mint Grotesk, sans-serif'",
              fontSize: "1.5rem",
              lineHeight: 1.6,
            }}
          >
            Growing up surrounded by the raw beauty of the Andaman Islands
            shaped the way I see the world. The silence of the ocean, the depth
            of the skies, and the untamed nature around me slowly built my
            creative perspective.
          </p>

          <p
            style={{
              marginBottom: "1.8em",
              fontFamily: "'Mint Grotesk, sans-serif'",
              fontSize: "1.5rem",
              lineHeight: 1.6,
            }}
          >
            I have always been drawn to creating things, from sketching on paper
            to capturing moments through a lens. When I picked up a camera, it
            felt natural, like I finally found a way to express what words never
            could.
          </p>

          <p
            style={{
              marginBottom: "1.8em",
              fontFamily: "'Mint Grotesk, sans-serif'",
              fontSize: "1.5rem",
              lineHeight: 1.6,
            }}
          >
            My work reflects how I experience life, cinematic, emotional, and
            deeply immersive. I don’t just capture visuals; I try to translate
            feelings into frames, turning ordinary moments into something that
            lingers.
          </p>

          <p
            style={{
              marginBottom: "1.8em",
              fontFamily: "'Mint Grotesk, sans-serif'",
              fontSize: "1.5rem",
              lineHeight: 1.6,
            }}
          >
            Over time, this curiosity pushed me beyond photography into
            filmmaking and visual storytelling. Exploring new perspectives,
            experimenting with color, and chasing light became a constant part
            of my journey.
          </p>

          <p
            style={{
              marginBottom: "1.8em",
              fontFamily: "'Mint Grotesk, sans-serif'",
              fontSize: "1.5rem",
              lineHeight: 1.6,
            }}
          >
            Long hours, quiet struggles, and the patience to wait for the
            perfect frame taught me that the most powerful visuals are not just
            captured, they are felt.
          </p>
        </div>
      </section>

      {/* Mobile Fixes */}
      <style>{`
        @media (max-width: 768px) {
          .create-section {
            grid-template-columns: 1fr !important;
            gap: 50px !important;
          }
        }
      `}</style>
    </div>
  );
}
