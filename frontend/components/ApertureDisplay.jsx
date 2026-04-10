import { useDarkMode } from "../hooks/useDarkMode";

export default function ApertureDisplay() {
  const { isDark, toggle } = useDarkMode();
  return (
    <button
      onClick={toggle}
      className="aperture-btn"
      aria-label="Toggle dark mode"
    >
      <span>{isDark ? "F/23" : "F/1.4"}</span>
      {/* <span className="aperture-warm">F/1.4</span> */}
    </button>
  );
}