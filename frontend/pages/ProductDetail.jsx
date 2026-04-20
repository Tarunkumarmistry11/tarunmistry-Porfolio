import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { gsap } from "gsap";
import { getProductBySlug } from "../features/shop/shopSlice";
import { addItem, openCart } from "../features/cart/cartSlice";
import CartIcon from "../components/shop/CartIcon";
import CartDrawer from "../components/shop/CartDrawer";
import {
  getUserCountry,
  getPrice,
  getOriginal,
  getSymbol,
  getDiscount,
} from "../src/utils/currency";
import { submitReview } from "../api/shopApi";
// Import your existing legal components
import ContactUs from "../pages/legal/ContactUs";
import FAQ from "../pages/legal/FAQ";
import Privacy from "../pages/legal/Privacy";
import Terms from "../pages/legal/Terms";
import Refunds from "../pages/legal/Refunds";
//import your email subscription component
import EmailSubscribe from "../components/shop/EmailSubscribe";
//Payment methods component
import PaymentMethods from "../components/shop/PaymentMethods";

export default function ProductDetail() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { current: product, loading, error } = useSelector((s) => s.shop);

  const [country, setCountry] = useState("US");
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [quantity, setQuantity] = useState(1);
  const [review, setReview] = useState({
    name: "",
    email: "",
    rating: 5,
    comment: "",
  });
  const [reviewSent, setReviewSent] = useState(false);

  const titleRef = useRef(null);
  const infoRef = useRef(null);

  useEffect(() => {
    getUserCountry().then(setCountry);
  }, []);
  useEffect(() => {
    dispatch(getProductBySlug(slug));
  }, [dispatch, slug]);

  // Entrance animation
  useEffect(() => {
    if (!product || !titleRef.current || !infoRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.1 },
      );
      gsap.fromTo(
        infoRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.25 },
      );
    });
    return () => ctx.revert();
  }, [product]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.65rem",
            color: "var(--fg40)",
          }}
        >
          Loading...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          padding: "120px clamp(20px,5vw,80px)",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.85rem",
            color: "var(--fg40)",
          }}
        >
          Product not found.
        </p>
        <button
          onClick={() => navigate("/shop")}
          style={{
            marginTop: "30px",
            padding: "12px 28px",
            borderRadius: "9999px",
            background: "var(--fg)",
            color: "var(--bg)",
            border: "none",
          }}
        >
          ← Back to Shop
        </button>
      </div>
    );
  }

  const allImages = [
    product.coverImage,
    ...(product.previewImages || []),
  ].filter(Boolean);
  const price = getPrice(product, country);
  const original = getOriginal(product, country);
  const symbol = getSymbol(country);
  const discount = getDiscount(product, country);

  const handleAddToCart = () => {
    dispatch(addItem({ product, quantity }));
    dispatch(openCart());
  };

  const handleBuyNow = () => {
    dispatch(addItem({ product, quantity }));
    navigate("/checkout");
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitReview(slug, review);
      setReviewSent(true);
    } catch (err) {
      console.error(err);
    }
  };

  const TABS = ["description", "compatibility", "includes", "howToUse", "faqs"];
  const TAB_LABELS = {
    description: "Description",
    compatibility: "Compatibility",
    includes: "What's Included",
    howToUse: "How to Use",
    faqs: "FAQs",
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

      <div
        style={{
          padding:
            "clamp(90px,11vh,120px) clamp(20px,5vw,80px) clamp(60px,8vw,100px)",
          maxWidth: "1300px",
          margin: "0 auto",
        }}
      >
        {/* Back button */}
        <button
          onClick={() => navigate("/shop")}
          style={{
            background: "none",
            border: "none",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.8rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--fg40)",
            cursor: "pointer",
            marginBottom: "40px",
            padding: 0,
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg40)")}
        >
          ← Back to Shop
        </button>

        {/* Two-column layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(32px,6vw,100px)",
            alignItems: "start",
            marginBottom: "clamp(60px,8vw,100px)",
          }}
          className="product-detail-grid"
        >
          {/* Left — image gallery */}
          <div>
            <div
              style={{
                aspectRatio: "3/4",
                overflow: "hidden",
                marginBottom: "12px",
              }}
            >
              <img
                src={allImages[activeImg]}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
            {allImages.length > 1 && (
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {allImages.map((src, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveImg(i)}
                    style={{
                      width: "60px",
                      height: "75px",
                      overflow: "hidden",
                      cursor: "pointer",
                      outline:
                        i === activeImg
                          ? "1.5px solid var(--fg)"
                          : "1.5px solid transparent",
                      transition: "outline 0.2s ease",
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
            )}
          </div>

          {/* Right — product info */}
          <div ref={infoRef} style={{ opacity: 0 }}>
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.8rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--fg40)",
                marginBottom: "10px",
              }}
            >
              {product.category}
            </p>

            <h1
              ref={titleRef}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.8rem,3.5vw,3rem)",
                fontWeight: 400,
                lineHeight: 1.1,
                color: "var(--fg)",
                margin: "0 0 20px",
                opacity: 0,
              }}
            >
              {product.name}
            </h1>

            {/* Price */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "12px",
                marginBottom: "24px",
              }}
            >
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "1.5rem",
                  color: "var(--fg)",
                }}
              >
                {symbol}
                {price}
              </span>
              {original && (
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "1rem",
                    color: "var(--fg40)",
                    textDecoration: "line-through",
                  }}
                >
                  {symbol}
                  {original}
                </span>
              )}
              {discount && (
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.8rem",
                    color: "var(--fg)",
                    background: "var(--fg10)",
                    padding: "3px 8px",
                  }}
                >
                  Save {discount}%
                </span>
              )}
            </div>

            {/* Rating */}
            {product.totalReviews > 0 && (
              <p
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.6rem",
                  color: "var(--fg60)",
                  marginBottom: "20px",
                }}
              >
                ★ {product.avgRating} · {product.totalReviews} review
                {product.totalReviews !== 1 ? "s" : ""}
              </p>
            )}

            {/* Short description */}
            {product.shortDesc && (
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.95rem",
                  lineHeight: 1.75,
                  color: "var(--fg60)",
                  marginBottom: "28px",
                }}
              >
                {product.shortDesc}
              </p>
            )}

            {/* Quantity */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.8rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--fg40)",
                }}
              >
                Qty
              </span>
              {["−", "+"].map((l, i) => (
                <button
                  key={l}
                  onClick={() =>
                    setQuantity((q) => Math.max(1, q + (i === 0 ? -1 : 1)))
                  }
                  style={{
                    background: "none",
                    border: "1px solid var(--fg20)",
                    color: "var(--fg)",
                    width: "28px",
                    height: "28px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  {l}
                </button>
              ))}
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.75rem",
                }}
              >
                {quantity}
              </span>
            </div>

            {/* CTAs */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                flexDirection: "column",
                marginBottom: "20px",
              }}
            >
              <button
                onClick={handleAddToCart}
                style={{
                  background: "none",
                  border: "1.5px solid var(--fg)",
                  borderRadius: "9999px",
                  color: "var(--fg)",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.8rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  padding: "14px 24px",
                  cursor: "pointer",
                  transition: "background 0.25s ease, color 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--fg)";
                  e.currentTarget.style.color = "var(--bg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--fg)";
                }}
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                style={{
                  background: "var(--fg)",
                  border: "1.5px solid var(--fg)",
                  borderRadius: "9999px",
                  color: "var(--bg)",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.8rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  padding: "14px 24px",
                  cursor: "pointer",
                  transition: "opacity 0.25s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Buy Now
              </button>
            </div>

            {/* Delivery notice */}
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.08em",
                color: "var(--fg40)",
                lineHeight: 1.6,
              }}
            >
              📧 Files delivered via email after purchase.
              <br />
              Download links expire in 48 hours.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: "clamp(48px,7vw,80px)" }}>
          <div
            style={{
              display: "flex",
              gap: "24px",
              borderBottom: "1px solid var(--fg20)",
              marginBottom: "32px",
              flexWrap: "wrap",
            }}
          >
            {TABS.map((tab) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    background: "none",
                    border: "none",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.8rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: active ? "var(--fg)" : "var(--fg40)",
                    cursor: "pointer",
                    paddingBottom: "12px",
                    borderBottom: active
                      ? "1.5px solid var(--fg)"
                      : "1.5px solid transparent",
                    marginBottom: "-1px",
                    transition: "color 0.2s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  {TAB_LABELS[tab]}
                </button>
              );
            })}
          </div>

          <div style={{ maxWidth: "680px" }}>
            {activeTab === "description" && (
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.97rem",
                  lineHeight: 1.85,
                  color: "var(--fg60)",
                }}
              >
                {product.description}
              </p>
            )}
            {activeTab === "compatibility" && (
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {(product.compatibility || []).map((c, i) => (
                  <li
                    key={i}
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.65rem",
                      color: "var(--fg)",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span style={{ color: "var(--fg40)" }}>✓</span> {c}
                  </li>
                ))}
              </ul>
            )}
            {activeTab === "includes" && (
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {(product.includes || []).map((item, i) => (
                  <li
                    key={i}
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.65rem",
                      color: "var(--fg)",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span style={{ color: "var(--fg40)" }}>—</span> {item}
                  </li>
                ))}
              </ul>
            )}
            {activeTab === "howToUse" && (
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.97rem",
                  lineHeight: 1.85,
                  color: "var(--fg60)",
                  whiteSpace: "pre-line",
                }}
              >
                {product.howToUse}
              </p>
            )}
            {activeTab === "faqs" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                {(product.faqs || []).map((faq, i) => (
                  <div
                    key={i}
                    style={{
                      borderBottom: "1px solid var(--fg10)",
                      paddingBottom: "20px",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1rem",
                        fontWeight: 400,
                        color: "var(--fg)",
                        marginBottom: "8px",
                      }}
                    >
                      {faq.question}
                    </p>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.9rem",
                        lineHeight: 1.75,
                        color: "var(--fg60)",
                      }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div
          style={{
            borderTop: "1px solid var(--fg20)",
            paddingTop: "clamp(40px,5vw,64px)",
          }}
        >
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.8rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--fg40)",
              marginBottom: "32px",
            }}
          >
            Reviews{" "}
            {product.totalReviews > 0 ? `(${product.totalReviews})` : ""}
          </p>

          {(product.reviews || []).length === 0 ? (
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                color: "var(--fg40)",
                marginBottom: "40px",
              }}
            >
              No reviews yet — be the first.
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                marginBottom: "48px",
              }}
            >
              {product.reviews.map((r, i) => (
                <div
                  key={i}
                  style={{
                    borderBottom: "1px solid var(--fg10)",
                    paddingBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "0.62rem",
                        color: "var(--fg)",
                      }}
                    >
                      {r.name}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "0.62rem",
                        color: "var(--fg40)",
                      }}
                    >
                      {"★".repeat(r.rating)}
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.9rem",
                      lineHeight: 1.75,
                      color: "var(--fg60)",
                      margin: 0,
                    }}
                  >
                    {r.comment}
                  </p>
                </div>
              ))}
            </div>
          )}

          {reviewSent ? (
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                color: "var(--fg60)",
              }}
            >
              Thank you for your review.
            </p>
          ) : (
            <form
              onSubmit={handleReviewSubmit}
              style={{
                maxWidth: "520px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <p
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.8rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--fg40)",
                  margin: "0 0 4px",
                }}
              >
                Leave a review
              </p>
              {[
                { field: "name", placeholder: "Your name" },
                {
                  field: "email",
                  placeholder: "Email (not published)",
                  type: "email",
                },
              ].map(({ field, placeholder, type = "text" }) => (
                <input
                  key={field}
                  type={type}
                  placeholder={placeholder}
                  required
                  value={review[field]}
                  onChange={(e) =>
                    setReview((r) => ({ ...r, [field]: e.target.value }))
                  }
                  style={{
                    background: "transparent",
                    border: "1px solid var(--fg20)",
                    color: "var(--fg)",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.8rem",
                    padding: "12px 14px",
                    outline: "none",
                    letterSpacing: "0.06em",
                  }}
                />
              ))}
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.8rem",
                    color: "var(--fg40)",
                  }}
                >
                  Rating
                </span>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setReview((r) => ({ ...r, rating: n }))}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "16px",
                      color: n <= review.rating ? "var(--fg)" : "var(--fg20)",
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Your thoughts..."
                required
                rows={4}
                value={review.comment}
                onChange={(e) =>
                  setReview((r) => ({ ...r, comment: e.target.value }))
                }
                style={{
                  background: "transparent",
                  border: "1px solid var(--fg20)",
                  color: "var(--fg)",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                  padding: "12px 14px",
                  outline: "none",
                  resize: "vertical",
                }}
              />
              <button
                type="submit"
                style={{
                  background: "var(--fg)",
                  border: "none",
                  borderRadius: "9999px",
                  color: "var(--bg)",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.7rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  padding: "13px 24px",
                  cursor: "pointer",
                  alignSelf: "flex-start",
                  transition: "opacity 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Submit Review
              </button>
            </form>
          )}
        </div>
      </div>

      {/* "More" Links Section - Clean version matching your image */}
      <div
        style={{
          padding: "100px 20px 120px",
          background: "var(--bg)",
          textAlign: "center",
        }}
      >
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.2rem, 5.5vw, 3rem)",
            fontWeight: 400,
            color: "var(--fg)",
            marginBottom: "48px",
          }}
        >
          More
        </h3>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "clamp(32px, 6vw, 60px)",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.78rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          {[
            { label: "Blog", to: "/blog" },
            { label: "FAQ", to: "/faq" },
            { label: "Contact us", to: "/contact" },
            { label: "Privacy", to: "/privacy" },
            { label: "Terms & Conditions", to: "/terms" },
            { label: "Refund policy", to: "/refunds" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              style={{
                color: "var(--fg70)",
                textDecoration: "none",
                transition: "color 0.3s ease",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--fg)";
                gsap.to(e.currentTarget, {
                  scale: 1.08,
                  y: -2,
                  duration: 0.4,
                  ease: "power2.out",
                });
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--fg70)";
                gsap.to(e.currentTarget, {
                  scale: 1,
                  y: 0,
                  duration: 0.35,
                  ease: "power2.out",
                });
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <div
        style={{
          borderTop: "1px solid var(--fg10, rgba(26,26,26,0.08))",
          background: "var(--bg)",
        }}
      >
        <EmailSubscribe />
      </div>
      <div style={{
        
        background: "var(--bg)",
      }}>
        <PaymentMethods />
      </div>

      <style>{`
        @media (max-width: 768px) {
          .product-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
