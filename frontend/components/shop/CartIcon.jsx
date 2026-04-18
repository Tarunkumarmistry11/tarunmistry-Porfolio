import { useDispatch, useSelector } from "react-redux";
import { toggleCart, selectCartCount } from "../../features/cart/cartSlice";

export default function CartIcon() {
  const dispatch = useDispatch();
  const count    = useSelector(selectCartCount);

  return (
    <button
      onClick={() => dispatch(toggleCart())}
      aria-label="Open cart"
      style={{
        position:       "fixed",
        bottom:         "32px",
        right:          "32px",
        zIndex:         200,
        background:     "var(--fg)",
        color:          "var(--bg)",
        border:         "none",
        width:          "52px",
        height:         "52px",
        borderRadius:   "50%",
        cursor:         "pointer",
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        gap:            "2px",
        transition:     "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
      {count > 0 && (
        <span style={{
          fontFamily:    "'Space Mono', monospace",
          fontSize:      "8px",
          lineHeight:    1,
          letterSpacing: 0,
        }}>
          {count}
        </span>
      )}
    </button>
  );
}