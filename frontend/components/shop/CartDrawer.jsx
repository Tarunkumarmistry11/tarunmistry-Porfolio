import { useEffect, useRef }        from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate }              from "react-router-dom";
import { gsap }                     from "gsap";
import {
  selectCartItems, selectCartIsOpen, selectCartTotal,
  closeCart, removeItem, updateQuantity,
} from "../../features/cart/cartSlice";

export default function CartDrawer() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const items     = useSelector(selectCartItems);
  const isOpen    = useSelector(selectCartIsOpen);
  const total     = useSelector(selectCartTotal("IN"));
  const drawerRef = useRef(null);

  // Slide in/out with GSAP
  useEffect(() => {
    const el = drawerRef.current;
    if (!el) return;
    gsap.to(el, {
      x:        isOpen ? "0%" : "100%",
      duration: isOpen ? 0.55 : 0.4,
      ease:     isOpen ? "power3.out" : "power3.in",
    });
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") dispatch(closeCart()); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [dispatch]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => dispatch(closeCart())}
          style={{
            position: "fixed",
            inset:    0,
            zIndex:   198,
            background: "rgba(0,0,0,0.5)",
          }}
        />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        style={{
          position:      "fixed",
          top:           0,
          right:         0,
          bottom:        0,
          zIndex:        199,
          width:         "clamp(300px,40vw,460px)",
          background:    "var(--bg)",
          borderLeft:    "1px solid var(--fg20, rgba(26,26,26,0.2))",
          display:       "flex",
          flexDirection: "column",
          transform:     "translateX(100%)",
        }}
      >
        {/* Header */}
        <div style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          padding:        "22px 28px",
          borderBottom:   "1px solid var(--fg10, rgba(26,26,26,0.1))",
          position:       "sticky",
          top:            0,
          background:     "var(--bg)",
          zIndex:         1,
        }}>
          <p style={{
            fontFamily:    "'Space Mono', monospace",
            fontSize:      "0.62rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color:         "var(--fg)",
            margin:        0,
          }}>
            Cart ({items.reduce((n, i) => n + i.quantity, 0)})
          </p>
          <button
            onClick={() => dispatch(closeCart())}
            style={{
              background:    "none",
              border:        "none",
              fontFamily:    "'Space Mono', monospace",
              fontSize:      "0.62rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color:         "var(--fg60, rgba(26,26,26,0.6))",
              cursor:        "pointer",
            }}
          >
            Close
          </button>
        </div>

        {/* Items */}
        <div style={{
          flex:           1,
          overflowY:      "auto",
          padding:        "20px 28px",
          display:        "flex",
          flexDirection:  "column",
          gap:            "20px",
        }}>
          {items.length === 0 ? (
            <p style={{
              fontFamily:  "'Playfair Display', serif",
              fontSize:    "1rem",
              fontStyle:   "italic",
              color:       "var(--fg40, rgba(26,26,26,0.4))",
              textAlign:   "center",
              marginTop:   "48px",
            }}>
              Your cart is empty.
            </p>
          ) : (
            items.map((item) => (
              <div key={item._id} style={{
                display:             "grid",
                gridTemplateColumns: "60px 1fr auto",
                gap:                 "14px",
                alignItems:          "start",
                paddingBottom:       "20px",
                borderBottom:        "1px solid var(--fg10, rgba(26,26,26,0.1))",
              }}>
                <img
                  src={item.coverImage}
                  alt={item.name}
                  style={{ width:"60px", height:"75px", objectFit:"cover", display:"block" }}
                />
                <div>
                  <p style={{
                    fontFamily:   "'Playfair Display', serif",
                    fontSize:     "0.9rem",
                    color:        "var(--fg)",
                    margin:       "0 0 3px",
                    lineHeight:   1.3,
                  }}>
                    {item.name}
                  </p>
                  <p style={{
                    fontFamily:    "'Space Mono', monospace",
                    fontSize:      "0.55rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color:         "var(--fg40, rgba(26,26,26,0.4))",
                    margin:        "0 0 12px",
                  }}>
                    {item.category}
                  </p>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                    {["−","+"].map((label, idx) => (
                      <button key={label}
                        onClick={() => dispatch(updateQuantity({
                          id: item._id,
                          quantity: item.quantity + (idx === 0 ? -1 : 1),
                        }))}
                        style={{
                          background: "none",
                          border:     "1px solid var(--fg20, rgba(26,26,26,0.2))",
                          color:      "var(--fg)",
                          width:      "24px",
                          height:     "24px",
                          cursor:     "pointer",
                          fontSize:   "14px",
                          display:    "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {label}
                      </button>
                    ))}
                    <span style={{ fontFamily:"'Space Mono', monospace", fontSize:"0.62rem" }}>
                      {item.quantity}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <p style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize:   "0.8rem",
                    color:      "var(--fg)",
                    margin:     "0 0 8px",
                  }}>
                    ₹{(item.price?.IN ?? 0) * item.quantity}
                  </p>
                  <button
                    onClick={() => dispatch(removeItem(item._id))}
                    style={{
                      background:    "none",
                      border:        "none",
                      cursor:        "pointer",
                      fontFamily:    "'Space Mono', monospace",
                      fontSize:      "0.52rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color:         "var(--fg40, rgba(26,26,26,0.4))",
                      transition:    "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg40, rgba(26,26,26,0.4))")}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{
            padding:    "20px 28px",
            borderTop:  "1px solid var(--fg20, rgba(26,26,26,0.2))",
            background: "var(--bg)",
          }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"8px" }}>
              <span style={{ fontFamily:"'Space Mono', monospace", fontSize:"0.6rem", letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--fg60, rgba(26,26,26,0.6))" }}>
                Total
              </span>
              <span style={{ fontFamily:"'Space Mono', monospace", fontSize:"0.9rem", color:"var(--fg)" }}>
                ₹{total}
              </span>
            </div>
            <p style={{
              fontFamily:    "'Space Mono', monospace",
              fontSize:      "0.52rem",
              letterSpacing: "0.08em",
              color:         "var(--fg40, rgba(26,26,26,0.4))",
              marginBottom:  "16px",
              textAlign:     "center",
            }}>
              Files delivered via email after purchase
            </p>
            <button
              onClick={() => { dispatch(closeCart()); navigate("/checkout"); }}
              style={{
                width:         "100%",
                background:    "var(--fg)",
                color:         "var(--bg)",
                border:        "none",
                fontFamily:    "'Space Mono', monospace",
                fontSize:      "0.62rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                padding:       "15px",
                cursor:        "pointer",
                transition:    "opacity 0.25s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}