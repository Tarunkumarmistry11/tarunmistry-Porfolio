import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  getShopProducts,
  setFilter,
  setSort,
} from "../features/shop/shopSlice";
import ProductCard from "../components/shop/ProductCard";
import CartIcon from "../components/shop/CartIcon";
import CartDrawer from "../components/shop/CartDrawer";
import { getUserCountry } from "../src/utils/currency";

gsap.registerPlugin(ScrollTrigger);

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Presets", value: "presets" },
  { label: "LUTs", value: "luts" },
  { label: "Prints", value: "prints" },
];

const SORT_OPTIONS = [
  { label: "Relevance", value: "relevance" },
  { label: "Lowest Price", value: "price_asc" },
  { label: "Highest Price", value: "price_desc" },
  { label: "Top Customer Reviews", value: "top_reviews" },
  { label: "Most Recent", value: "new" },
];

const FAQ_ITEMS = [
  {
    q: "What are Lightroom presets?",
    a: "Lightroom presets are saved editing settings that allow you to apply a consistent look to your photos with one click.",
  },
  {
    q: "What app or program do I need to use the presets?",
    a: "Our photo presets work in Adobe Lightroom (both desktop and mobile). Video LUTs work in DaVinci Resolve, Premiere Pro, Final Cut Pro, and VN Video Editor.",
  },
  {
    q: "What are Video Filters (LUTs)?",
    a: "LUTs (Look-Up Tables) are color grading tools that transform the look of your video footage instantly.",
  },
  {
    q: "How do I receive the presets or filters?",
    a: "After purchase, you will receive an email with direct download links. The files are also available in your account.",
  },
  {
    q: "I'm having trouble downloading from the link",
    a: "Try using a different browser or incognito mode. The links are valid for 48 hours.",
  },
  {
    q: "What happens if my download link expires after 48 hours?",
    a: "The download link sent to your email is valid for 48 hours for security reasons. If it expires, simply reach out to our support team with your purchase details, and we will provide you with a fresh download link. Your purchase remains secure and accessible, as the expiration only applies to the link and not your access to the files. We are here to ensure you can access your presets and LUTs without any hassle.",
  },
  {
    q: "How do I install them?",
    a: "Detailed installation instructions are included with every purchase for both mobile and desktop.",
  },
  {
    q: "If I buy a new phone or computer, can I transfer the presets?",
    a: "Yes, you can re-download them anytime from the email or your account.",
  },
  {
    q: "Can I share my purchase with others?",
    a: "No. Each license is for personal use only.",
  },
  {
    q: "Do you accept refunds?",
    a: "Due to the digital nature of the products, all sales are final.",
  },
];

export default function Shop() {
  const dispatch = useDispatch();
  const { products, filter, sort, loading } = useSelector((s) => s.shop);

  const [country, setCountry] = useState("US");
  const [sortOpen, setSortOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const titleRef = useRef(null);
  const gridRef = useRef(null);
  const sortRef = useRef(null);

  // Get user country
  useEffect(() => {
    getUserCountry().then(setCountry);
  }, []);

  // Fetch products
  useEffect(() => {
    dispatch(getShopProducts({ category: filter, sort }));
  }, [dispatch, filter, sort]);

  // Hero title animation
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { yPercent: 110 },
      { yPercent: 0, duration: 1.2, ease: "power4.out", delay: 0.2 },
    );
  }, []);

  // Product cards stagger
  useEffect(() => {
    if (loading || !gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".shop-card");
    if (!cards.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.07 },
      );
    });
    return () => ctx.revert();
  }, [products, loading]);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setSortOpen(false);
    if (sortOpen) window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [sortOpen]);

  useEffect(() => {
    if (!sortRef.current) return;

    if (sortOpen) {
      gsap.fromTo(
        sortRef.current,
        { opacity: 0, y: -10, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: "power2.out" },
      );
    } else {
      gsap.to(sortRef.current, {
        opacity: 0,
        y: -10,
        scale: 0.96,
        duration: 0.2,
        ease: "power2.in",
      });
    }
  }, [sortOpen]);

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === sort)?.label || "Relevance";

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
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
      <CartIcon />
      <CartDrawer />

      {/* HERO TITLE */}
      <section
        style={{
          padding: "clamp(100px,12vh,140px) clamp(20px,5vw,80px) 0",
          maxWidth: "1300px",
          margin: "0 auto",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <h1
            ref={titleRef}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(4rem,13vw,4.5rem)",
              fontWeight: 400,
              lineHeight: 0.92,
              letterSpacing: "-0.025em",
              color: "var(--fg)",
              margin: 0,
              // display: "flex",
              // alignItems: "baseline",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            Color is how I remember a{" "}
            <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
              moment
            </span>
            <span className="jumping-dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </h1>
        </div>

        <p
          style={{
            marginTop: "22px",
            maxWidth: "800px",
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(0.95rem,1.4vw,1.2rem)",
            lineHeight: 1.8,
            color: "var(--fg60)",
            letterSpacing: "0.01em",
            textAlign: "center",
            gap: "6px",
          }}
        >
          Carefully crafted presets and LUTs inspired by{" "}
          <span style={{ color: "var(--fg)" }}>natural tones</span> and{" "}
          <span style={{ color: "var(--fg)" }}>cinematic storytelling</span>.
        </p>

        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.8rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--fg40)",
            marginTop: "120px",
          }}
        >
          Presets · LUTs · Prints · All delivered via email
        </p>

        <style>{`
          .jumping-dots span {
            display: inline-block;
            animation: jumpDot 1.2s infinite;
            transform-origin: bottom;
          }
          .jumping-dots span:nth-child(2) { animation-delay: 0.15s; }
          .jumping-dots span:nth-child(3) { animation-delay: 0.3s; }
          @keyframes jumpDot {
            0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
            40% { transform: translateY(-6px); opacity: 1; }
          }
        `}</style>
      </section>

      {/* FILTERS + SORT */}
      <section
        style={{
          padding: "clamp(28px,4vw,48px) clamp(20px,5vw,80px) 0",
          maxWidth: "1300px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--fg20)",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          {/* Filter Tabs */}
          <div style={{ display: "flex", gap: "28px" }}>
            {FILTERS.map(({ label, value }) => {
              const active = filter === value;
              return (
                <button
                  key={value}
                  onClick={() => dispatch(setFilter(value))}
                  style={{
                    background: "none",
                    border: "none",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.8rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: active ? "var(--fg)" : "var(--fg40)",
                    cursor: "pointer",
                    paddingBottom: "14px",
                    borderBottom: active
                      ? "1.5px solid var(--fg)"
                      : "1.5px solid transparent",
                    marginBottom: "-1px",
                    transition: "color 0.25s ease, border-color 0.25s ease",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown */}
          <div style={{ position: "relative", paddingBottom: "14px" }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSortOpen((v) => !v);
              }}
              style={{
                background: "none",
                border: "none",
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.8rem",
                letterSpacing: "0.1em",
                color: "var(--fg)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span style={{ color: "var(--fg60)" }}>Sort by:</span>
              <strong style={{ color: "var(--fg)", fontWeight: 600 }}>
                {currentSortLabel}
              </strong>
              <svg
                width="11"
                height="11"
                viewBox="0 0 11 11"
                fill="currentColor"
                style={{
                  transition: "transform 0.25s ease",
                  transform: sortOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                <path d="M5.5 0.5L3 3.5H8L5.5 0.5Z" />
                <path d="M5.5 10.5L3 7.5H8L5.5 10.5Z" />
              </svg>
            </button>

            {sortOpen && (
              <div
                ref={sortRef}
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: "absolute",
                  // top: "calc(100% + 8px)",
                  // right: 0,
                  background: "var(--bg)",
                  border: "1px solid var(--fg20)",
                  zIndex: 100,
                  minWidth: "230px",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                {SORT_OPTIONS.map(({ label, value }) => {
                  const active = sort === value;
                  return (
                    <button
                      key={value}
                      onClick={() => {
                        dispatch(setSort(value));
                        setSortOpen(false);
                      }}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        background: active ? "var(--fg05)" : "transparent",
                        border: "none",
                        borderBottom: "1px solid var(--fg10)",
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "0.8rem",
                        color: active ? "var(--fg)" : "var(--fg60)",
                        padding: "14px 18px",
                        cursor: "pointer",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section
        style={{
          padding:
            "clamp(36px,5vw,64px) clamp(20px,5vw,80px) clamp(80px,10vw,120px)",
          maxWidth: "1300px",
          margin: "0 auto",
        }}
      >
        {loading ? (
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.65rem",
              color: "var(--fg40)",
            }}
          >
            Loading...
          </p>
        ) : products.length === 0 ? (
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.1rem",
              fontStyle: "italic",
              color: "var(--fg40)",
            }}
          >
            Nothing here yet.
          </p>
        ) : (
          <div
            ref={gridRef}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "clamp(24px, 3.5vw, 48px)",
            }}
          >
            {products.map((p) => (
              <div key={p._id} className="shop-card" style={{ opacity: 0 }}>
                <ProductCard product={p} country={country} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* WHY EL3V3N? */}
      <section
        style={{
          padding: "clamp(80px, 10vw, 140px) clamp(20px, 5vw, 80px)",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.6rem, 6vw, 3.2rem)",
            lineHeight: 0.5,
            marginBottom: "42px",
          }}
        >
          Why EL3V3N?
        </h2>
        <div
          style={{
            fontSize: "clamp(1.05rem, 1.8vw, 1.15rem)",
            lineHeight: 1.85,
            color: "var(--fg70)",
            maxWidth: "820px",
          }}
        >
          <p
            style={{
              marginBottom: "1.2em",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Created by EL3V3N, these Lightroom presets and editing guides are
            the result of years spent observing light, shaping color, and
            refining a visual language that feels both cinematic and honest.
          </p>
          <p
            style={{
              marginBottom: "1.2em",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Every tone, every contrast, every subtle shift has been carefully
            crafted to help you achieve a distinctive and immersive look in your
            images.
          </p>
          <p
            style={{
              marginBottom: "1.2em",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            These are not just presets, they are a reflection of a daily
            workflow. The same tools and techniques used consistently to shape
            photographs, build a visual identity, and tell stories that feel
            atmospheric and real.
          </p>
          <p
            style={{
              marginBottom: "1.2em",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            By stepping into this process, you are not just applying edits, you
            are learning how to see. You will understand how to build mood,
            control color with intention, and create a cohesive style across
            your work.
          </p>
          <p
            style={{
              marginTop: "1.2em",
              fontFamily: "'Playfair Display', serif",
              color: "var(--fg60)",
            }}
          >
            This is about giving you the clarity, control, and confidence to
            create images that feel like your own, consistent, expressive, and
            deeply cinematic.{" "}
          </p>
        </div>
      </section>

      {/* HOW THEY WORK */}
      <section
        style={{
          padding: "clamp(80px, 10vw, 100px) clamp(20px, 5vw, 80px)",
          maxWidth: "1100px",
          margin: "0 auto",
          background: "var(--bg)",
        }}
      >
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.6rem, 6vw, 3.8rem)",
            marginBottom: "42px",
          }}
        >
          How They Work?
        </h2>
        <div
          style={{
            fontSize: "clamp(1.05rem, 1.8vw, 1.15rem)",
            lineHeight: 1.85,
            color: "var(--fg70)",
            maxWidth: "780px",
          }}
        >
          <p
            style={{
              marginBottom: "2em",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Our <strong>LUTs (Video Filters)</strong> can be easily imported
            into the free version of VN Video app to edit on your mobile. They
            can also be used in any other video editing apps that accept LUT
            files such as DaVinci Resolve, Premiere Pro.
          </p>
          <p
            style={{
              marginBottom: "2em",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Our <strong>Photo Preset Filters</strong> are designed to be used
            both in the free version of Lightroom Mobile app and also on the
            desktop Lightroom app.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section
        style={{
          padding: "clamp(80px, 10vw, 140px) clamp(20px, 5vw, 80px)",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.6rem, 6vw, 3.8rem)",
            marginBottom: "50px",
            textAlign: "center",
          }}
        >
          FAQ
        </h2>

        <div style={{ maxWidth: "820px", margin: "0 auto" }}>
          {FAQ_ITEMS.map((item, index) => (
            <div
              key={index}
              style={{
                borderBottom: "1px solid var(--fg20)",
                marginBottom: "8px",
              }}
            >
              <button
                onClick={() => toggleFaq(index)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  padding: "22px 0",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.95rem",
                  color: "var(--fg)",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {item.q}
                <span
                  style={{
                    fontSize: "1.4rem",
                    transition: "transform 0.4s ease",
                    transform:
                      openFaqIndex === index ? "rotate(45deg)" : "rotate(0deg)",
                  }}
                >
                  +
                </span>
              </button>

              <div
                style={{
                  maxHeight: openFaqIndex === index ? "400px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.5s ease, opacity 0.4s ease",
                  opacity: openFaqIndex === index ? 1 : 0,
                }}
              >
                <p
                  style={{
                    paddingBottom: "32px",
                    color: "var(--fg70)",
                    lineHeight: 1.75,
                  }}
                >
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
