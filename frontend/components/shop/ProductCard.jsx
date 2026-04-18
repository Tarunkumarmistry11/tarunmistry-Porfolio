import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { addItem, openCart } from "../../features/cart/cartSlice";
import { getPrice, getOriginal, getSymbol, getDiscount } from "../../src/utils/currency";

gsap.registerPlugin(ScrollTrigger);

export default function ProductCard({ product, country = "US" }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const wrapRef = useRef(null);
  const imgRef = useRef(null);
  const overlayRef = useRef(null);
  const viewBtnRef = useRef(null);
  const cartBtnRef = useRef(null);

  const price = getPrice(product, country);
  const original = getOriginal(product, country);
  const symbol = getSymbol(country);
  const discount = getDiscount(product, country);

  // Initial state
  useEffect(() => {
    if (viewBtnRef.current) gsap.set(viewBtnRef.current, { opacity: 0, y: 10 });
    if (overlayRef.current) gsap.set(overlayRef.current, { opacity: 0 });
  }, []);

  // Hover animations (card)
  const onEnter = () => {
    gsap.to(imgRef.current, { scale: 1.06, duration: 0.7, ease: "power2.out" });
    gsap.to(overlayRef.current, { opacity: 1, duration: 0.35 });
    gsap.to(viewBtnRef.current, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" });
  };

  const onLeave = () => {
    gsap.to(imgRef.current, { scale: 1, duration: 0.7, ease: "power2.out" });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.35 });
    gsap.to(viewBtnRef.current, { opacity: 0, y: 10, duration: 0.3 });
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addItem({ product, quantity: 1 }));
    dispatch(openCart());
  };

  // 🔥 GSAP Button Hover (Reusable)
  const initButtonAnimation = (ref) => {
    if (!ref.current) return;

    const el = ref.current;
    const bg = el.querySelector(".btn-bg");
    const text = el.querySelector(".btn-text");

    const enter = () => {
      gsap.to(bg, { scaleX: 1, duration: 0.4, ease: "power3.out" });
      gsap.to(text, { color: "var(--bg)", duration: 0.3 });
    };

    const leave = () => {
      gsap.to(bg, { scaleX: 0, duration: 0.4, ease: "power3.inOut" });
      gsap.to(text, { color: "var(--fg)", duration: 0.3 });
    };

    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);

    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
    };
  };

  useEffect(() => {
    const clean1 = initButtonAnimation(cartBtnRef);
    const clean2 = initButtonAnimation(viewBtnRef);
    return () => {
      clean1 && clean1();
      clean2 && clean2();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      onClick={() => navigate(`/shop/${product.slug}`)}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{ cursor: "pointer" }}
    >
      {/* IMAGE */}
      <div
        style={{
          position: "relative",
          aspectRatio: "3/4",
          overflow: "hidden",
          marginBottom: "16px",
        }}
      >
        <img
          ref={imgRef}
          src={product.coverImage}
          alt={product.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            willChange: "transform",
          }}
        />

        {/* OVERLAY */}
        <div
          ref={overlayRef}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.48)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* VIEW PRODUCT BUTTON */}
          <button
            ref={viewBtnRef}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/shop/${product.slug}`);
            }}
            style={{
              border: "1px solid #fff",
              borderRadius: "999px",
              padding: "12px 26px",
              background: "transparent",
              color: "#fff",
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.55rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
            }}
          >
            <span className="btn-bg" />
            <span className="btn-text">View Product</span>
          </button>
        </div>

        {/* DISCOUNT */}
        {discount && (
          <div
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              background: "var(--fg)",
              color: "var(--bg)",
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.52rem",
              letterSpacing: "0.08em",
              padding: "4px 8px",
            }}
          >
            -{discount}%
          </div>
        )}
      </div>

      {/* META */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "12px",
        }}
      >
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.55rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--fg40)",
              marginBottom: "4px",
            }}
          >
            {product.category}
          </p>

          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1rem,1.8vw,1.2rem)",
              fontWeight: 400,
              margin: 0,
            }}
          >
            {product.name}
          </h3>
        </div>

        <div style={{ textAlign: "right" }}>
          {original && (
            <p
              style={{
                fontSize: "0.55rem",
                textDecoration: "line-through",
                color: "var(--fg40)",
                margin: 0,
              }}
            >
              {symbol}{original}
            </p>
          )}

          <p style={{ fontSize: "0.82rem", margin: "0 0 10px" }}>
            {symbol}{price}
          </p>

          {/* CART BUTTON */}
          <button
            ref={cartBtnRef}
            onClick={handleAddToCart}
            style={{
              border: "1px solid var(--fg)",
              borderRadius: "999px",
              padding: "8px 16px",
              background: "transparent",
              color: "var(--fg)",
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.52rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
            }}
          >
            <span className="btn-bg" />
            <span className="btn-text">+ Cart</span>
          </button>
        </div>
      </div>

      {/* BUTTON ANIMATION STYLES */}
      <style>{`
        .btn-bg {
          position: absolute;
          inset: 0;
          background: var(--fg);
          transform: scaleX(0);
          transform-origin: left;
          z-index: 0;
        }

        .btn-text {
          position: relative;
          z-index: 1;
          transition: color 0.3s ease;
        }
      `}</style>
    </div>
  );
}