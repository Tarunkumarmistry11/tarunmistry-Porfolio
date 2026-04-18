import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Horizontal clip reveal — image wipes in from right to left as you scroll.
 * Returns { wrapperRef, imgRef }
 * Apply wrapperRef to the container div, imgRef to the <img> tag.
 */
export function useHorizontalReveal(options = {}) {
  const wrapperRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const img = imgRef.current;
    if (!wrapper || !img) return;

    const ctx = gsap.context(() => {
      // ── Clip reveal: right edge slides left ────────────
      gsap.fromTo(
        wrapper,
        {
          clipPath: "inset(0% 100% 0% 0%)",
        },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: options.duration || 1.6,
          ease: options.ease || "power3.inOut",
          scrollTrigger: {
            trigger: wrapper,
            start: options.start || "top 80%",
            end: options.end || "top 30%",
            scrub: options.scrub ?? 1.2,
            once: false,
          },
        },
      );

      // ── Image parallax: moves right as clip opens ──────
      gsap.fromTo(
        img,
        { xPercent: 8 },
        {
          xPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: wrapper,
            start: "top 80%",
            end: "top 30%",
            scrub: options.scrub ?? 1.2,
          },
        },
      );
    }, wrapper);

    return () => ctx.revert();
  }, []);

  return { wrapperRef, imgRef };
}
