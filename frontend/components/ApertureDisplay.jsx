import { useDarkMode } from "../hooks/useDarkMode";

export default function ApertureDisplay({ className = "" }) {
  const { isDark, toggle } = useDarkMode();

  return (
    <button
      onClick={toggle}
      className={`aperture-btn ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      <span>{isDark ? "F/23" : "F/24"}</span>
      <span className="warm">F/1.4</span>
    </button>
  );
}