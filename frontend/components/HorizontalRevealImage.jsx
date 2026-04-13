import { useHorizontalReveal } from "../hooks/useHorizontalReveal";

/**
 * A single image that reveals horizontally (right → left) on scroll.
 *
 * Props:
 *   src         — image URL
 *   alt         — alt text
 *   aspectRatio — CSS aspect-ratio string, default "16/9"
 *   scrub       — GSAP scrub value, default 1.2
 *   start       — ScrollTrigger start, default "top 80%"
 *   end         — ScrollTrigger end, default "top 30%"
 *   style       — extra styles on the outer wrapper
 */
export default function HorizontalRevealImage({
  src,
  alt     = "",
  aspectRatio = "16/9",
  scrub,
  start,
  end,
  style   = {},
}) {
  const { wrapperRef, imgRef } = useHorizontalReveal({ scrub, start, end });

  return (
    <div
      ref={wrapperRef}
      style={{
        width:       "100%",
        aspectRatio: aspectRatio,
        overflow:    "hidden",
        clipPath:    "inset(0% 100% 0% 0%)",
        willChange:  "clip-path",
        ...style,
      }}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        style={{
          width:      "108%",          /* slightly wider for parallax room */
          height:     "100%",
          objectFit:  "cover",
          display:    "block",
          marginLeft: "-4%",           /* center the wider image */
          willChange: "transform",
          transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      />
    </div>
  );
}