import { useEffect, useRef } from "react";
import { useDarkMode } from "../hooks/useDarkMode";

/*
  open  blades = light mode  (shutter open  = light coming in)
  closed blades = dark mode  (shutter closed = no light)

  Animation:
  - on open  → blades rotate +45deg out, closed fade in at 0deg
  - on close → blades rotate +45deg out, open  fade in at 0deg
  - hover    → subtle 15deg rotation to hint at interactivity
*/

const OPEN_PATH = `
  M327.606,14.073C302.091,5.11,274.774,0,246.216,0c-23.099,0-45.359,3.417-66.568,
  9.363l0.018,152.669L327.606,14.073z
  M468.235,140.417c-21.582-45.224-56.443-82.795-99.674-107.648L260.913,140.417H468.235z
  M12.249,169.751c-7.865,24.08-12.247,49.726-12.247,76.415c0,24.465,3.69,48.044,
  10.328,70.353h148.706L12.249,169.751z
  M355.753,466.411c43.773-21.838,80.117-56.199,104.273-98.557L355.753,263.571V466.411z
  M483.786,182.597H334.424l144.19,144.156c8.766-25.272,13.762-52.316,13.762-80.587
  C492.376,224.149,489.22,202.905,483.786,182.597z
  M170.382,480.355c23.903,7.735,49.352,12.022,75.834,12.022c23.387,0,45.918-3.482,
  67.357-9.572V337.134L170.382,480.355z
  M27.399,358.716c22.632,43.887,57.896,80.182,101.174,103.781l103.778-103.781H27.399z
  M137.453,25.579c-45.39,22.42-82.975,58.2-107.247,102.476l107.247,107.247V25.579z
`;

const CLOSED_PATH = `
  M 64,0 A 64,64 0 0 0 23.514999,14.48333
  C 31.884488,28.98026 40.2537,43.47734 48.62333,57.974167
  59.33609,39.41915 70.04931,20.86413 80.762496,2.30916
  A 64,64 0 0 0 64,0 Z
  M 86.5975,4.20333
  C 78.228066,18.69941 69.858513,33.19541 61.489165,47.69167
  H 125.85 A 64,64 0 0 0 86.5975,4.20333 Z
  M 18.951663,18.58167 A 64,64 0 0 0 -5e-7,64.000001
  64,64 0 0 0 0.86166564,74.308332 H 51.124164
  C 40.39994,55.732763 29.675929,37.15716 18.951663,18.58167 Z
  M 76.873331,53.691666
  C 87.597875,72.267125 98.323375,90.842186 109.04833,109.4175
  A 64,64 0 0 0 128,64.000001
  64,64 0 0 0 127.1375,53.691666 Z
  M 79.374165,70.025
  C 68.660706,88.579526 57.948331,107.13482 47.235831,125.69
  A 64,64 0 0 0 64,128
  64,64 0 0 0 104.48416,113.51583
  C 96.114172,99.018912 87.744209,84.521986 79.374165,70.025 Z
  M 2.1499985,80.308332
  A 64,64 0 0 0 41.400832,123.79583
  C 49.770061,109.30008 58.138935,94.804136 66.508331,80.308332 Z
`;

export default function ApertureDisplay() {
  const { isDark, toggle } = useDarkMode();
  const openRef   = useRef(null);
  const closedRef = useRef(null);
  const btnRef    = useRef(null);

  /* GSAP shutter animation */
  useEffect(() => {
    let gsap;
    import("gsap").then((mod) => {
      gsap = mod.gsap;

      const open   = openRef.current;
      const closed = closedRef.current;
      if (!open || !closed) return;

      if (isDark) {
        /* closing shutter — open blades spin out, closed blades spin in */
        gsap.to(open,   { rotation: 45,  opacity: 0, duration: 0.5, ease: "power3.in",  transformOrigin: "50% 50%" });
        gsap.fromTo(closed,
          { rotation: -45, opacity: 0 },
          { rotation: 0,   opacity: 1, duration: 0.55, ease: "power3.out", transformOrigin: "50% 50%", delay: 0.1 }
        );
      } else {
        /* opening shutter — closed blades spin out, open blades spin in */
        gsap.to(closed, { rotation: 45,  opacity: 0, duration: 0.5, ease: "power3.in",  transformOrigin: "50% 50%" });
        gsap.fromTo(open,
          { rotation: -45, opacity: 0 },
          { rotation: 0,   opacity: 1, duration: 0.55, ease: "power3.out", transformOrigin: "50% 50%", delay: 0.1 }
        );
      }
    });
  }, [isDark]);

  /* Set initial state without animation on mount */
  useEffect(() => {
    const open   = openRef.current;
    const closed = closedRef.current;
    if (!open || !closed) return;

    if (isDark) {
      open.style.opacity   = "0";
      closed.style.opacity = "1";
    } else {
      open.style.opacity   = "1";
      closed.style.opacity = "0";
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <button
      ref={btnRef}
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Open shutter — light mode" : "Close shutter — dark mode"}
      style={{
        background:  "none",
        border:      "none",
        padding:     0,
        cursor:      "pointer",
        display:     "flex",
        flexDirection: "column",
        alignItems:  "center",
        gap:         "3px",
        color:       "var(--fg)",
      }}
    >
      {/* Shutter icon */}
      <div style={{
        position: "relative",
        width:    "22px",
        height:   "22px",
        display:  "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {/* Open blades */}
        <svg
          ref={openRef}
          viewBox="0 0 492.378 492.378"
          fill="currentColor"
          style={{
            position:  "absolute",
            width:     "22px",
            height:    "22px",
            top: 0, left: 0,
            transition: "opacity 0.1s",
          }}
        >
          <path d={OPEN_PATH.replace(/\s+/g, " ").trim()} />
        </svg>

        {/* Closed blades */}
        <svg
          ref={closedRef}
          viewBox="0 0 128 128"
          fill="currentColor"
          style={{
            position:  "absolute",
            width:     "22px",
            height:    "22px",
            top: 0, left: 0,
            opacity:   0,
          }}
        >
          <path d={CLOSED_PATH.replace(/\s+/g, " ").trim()} />
        </svg>
      </div>

      {/* F-stop readout */}
      <div style={{
        fontFamily:    "'Space Mono', monospace",
        fontSize:      "8.5px",
        lineHeight:    1.4,
        letterSpacing: "0.04em",
        display:       "flex",
        flexDirection: "column",
        alignItems:    "center",
        color:         "var(--fg)",
        transition:    "color 0.4s ease",
      }}>
        <span>{isDark ? "F/23" : "F/24"}</span>
        <span style={{ color: "#c8b89a" }}>F/1.4</span>
      </div>
    </button>
  );
}