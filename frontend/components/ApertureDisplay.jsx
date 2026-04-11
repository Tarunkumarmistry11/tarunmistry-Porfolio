import { useEffect, useRef } from "react";
import { useDarkMode } from "../hooks/useDarkMode";

const OPEN_PATH = "M327.606,14.073C302.091,5.11,274.774,0,246.216,0c-23.099,0-45.359,3.417-66.568,9.363l0.018,152.669L327.606,14.073z M468.235,140.417c-21.582-45.224-56.443-82.795-99.674-107.648L260.913,140.417H468.235z M12.249,169.751c-7.865,24.08-12.247,49.726-12.247,76.415c0,24.465,3.69,48.044,10.328,70.353h148.706L12.249,169.751z M355.753,466.411c43.773-21.838,80.117-56.199,104.273-98.557L355.753,263.571V466.411z M483.786,182.597H334.424l144.19,144.156c8.766-25.272,13.762-52.316,13.762-80.587C492.376,224.149,489.22,202.905,483.786,182.597z M170.382,480.355c23.903,7.735,49.352,12.022,75.834,12.022c23.387,0,45.918-3.482,67.357-9.572V337.134L170.382,480.355z M27.399,358.716c22.632,43.887,57.896,80.182,101.174,103.781l103.778-103.781H27.399z M137.453,25.579c-45.39,22.42-82.975,58.2-107.247,102.476l107.247,107.247V25.579z";

const CLOSED_PATH = "M 64,0 A 64,64 0 0 0 23.514999,14.48333 C 31.884488,28.98026 40.2537,43.47734 48.62333,57.974167 59.33609,39.41915 70.04931,20.86413 80.762496,2.30916 A 64,64 0 0 0 64,0 Z M 86.5975,4.20333 C 78.228066,18.69941 69.858513,33.19541 61.489165,47.69167 H 125.85 A 64,64 0 0 0 86.5975,4.20333 Z M 18.951663,18.58167 A 64,64 0 0 0 -5e-7,64.000001 64,64 0 0 0 0.86166564,74.308332 H 51.124164 C 40.39994,55.732763 29.675929,37.15716 18.951663,18.58167 Z M 76.873331,53.691666 C 87.597875,72.267125 98.323375,90.842186 109.04833,109.4175 A 64,64 0 0 0 128,64.000001 64,64 0 0 0 127.1375,53.691666 Z M 79.374165,70.025 C 68.660706,88.579526 57.948331,107.13482 47.235831,125.69 A 64,64 0 0 0 64,128 64,64 0 0 0 104.48416,113.51583 C 96.114172,99.018912 87.744209,84.521986 79.374165,70.025 Z M 2.1499985,80.308332 A 64,64 0 0 0 41.400832,123.79583 C 49.770061,109.30008 58.138935,94.804136 66.508331,80.308332 Z";

export default function ApertureDisplay() {
  const { isDark, toggle } = useDarkMode();
  const openRef   = useRef(null);
  const closedRef = useRef(null);
  const isFirst   = useRef(true);

  // Set initial state on mount — no animation
  useEffect(() => {
    const o = openRef.current;
    const c = closedRef.current;
    if (!o || !c) return;
    if (isDark) {
      o.style.opacity   = "0";
      o.style.transform = "rotate(45deg)";
      c.style.opacity   = "1";
      c.style.transform = "rotate(0deg)";
    } else {
      o.style.opacity   = "1";
      o.style.transform = "rotate(0deg)";
      c.style.opacity   = "0";
      c.style.transform = "rotate(-45deg)";
    }
    // allow transitions after first paint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { isFirst.current = false; });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Animate on every toggle after mount
  useEffect(() => {
    if (isFirst.current) return;
    const o = openRef.current;
    const c = closedRef.current;
    if (!o || !c) return;

    if (isDark) {
      // shutter closing — open blades spin + fade out, closed blades spin in
      o.style.opacity   = "0";
      o.style.transform = "rotate(60deg)";
      setTimeout(() => {
        c.style.transition = "opacity 0.45s cubic-bezier(0.16,1,0.3,1), transform 0.55s cubic-bezier(0.16,1,0.3,1)";
        c.style.opacity   = "1";
        c.style.transform = "rotate(0deg)";
      }, 80);
    } else {
      // shutter opening — closed blades spin + fade out, open blades spin in
      c.style.opacity   = "0";
      c.style.transform = "rotate(60deg)";
      setTimeout(() => {
        o.style.transition = "opacity 0.45s cubic-bezier(0.16,1,0.3,1), transform 0.55s cubic-bezier(0.16,1,0.3,1)";
        o.style.opacity   = "1";
        o.style.transform = "rotate(0deg)";
      }, 80);
    }
  }, [isDark]);

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        background:  "none",
        border:      "none",
        padding:     "0",
        cursor:      "pointer",
        display:     "inline-flex",
        alignItems:  "center",
        gap:         "7px",
        opacity:     1,
        transition:  "opacity 0.25s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.5")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
    >
      {/* F-stop text */}
      <span style={{
        fontFamily:    "'Space Mono', monospace",
        fontSize:      "10px",
        letterSpacing: "0.05em",
        color:         "var(--fg)",
        transition:    "color 0.4s ease",
        lineHeight:    5,
        userSelect:    "none",
      }}>
        {isDark ? "F/23" : "F/1.4"}
      </span>

      {/* Shutter icon */}
      <div style={{
        position:  "relative",
        width:     "16px",
        height:    "16px",
        flexShrink: 0,
      }}>
        {/* Open — light mode */}
        <svg
          ref={openRef}
          viewBox="0 0 492.378 492.378"
          fill="currentColor"
          style={{
            position:        "absolute",
            inset:           0,
            width:           "16px",
            height:          "16px",
            color:           "var(--fg)",
            transformOrigin: "50% 50%",
            transition:      "opacity 0.45s cubic-bezier(0.16,1,0.3,1), transform 0.55s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <path d={OPEN_PATH} />
        </svg>

        {/* Closed — dark mode */}
        <svg
          ref={closedRef}
          viewBox="0 0 128 128"
          fill="currentColor"
          style={{
            position:        "absolute",
            inset:           0,
            width:           "16px",
            height:          "16px",
            color:           "var(--fg)",
            transformOrigin: "50% 50%",
            transition:      "opacity 0.45s cubic-bezier(0.16,1,0.3,1), transform 0.55s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <path d={CLOSED_PATH} />
        </svg>
      </div>
    </button>
  );
}