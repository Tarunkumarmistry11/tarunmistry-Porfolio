import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useScrollReveal = (options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          opacity: 0,
          y: options.y ?? 60,
        },
        {
          opacity: 1,
          y: 0,
          duration: options.duration ?? 1.1,
          ease: options.ease ?? "power3.out",
          scrollTrigger: {
            trigger: el,
            start: options.start ?? "top 88%",
            once: true,
          },
        },
      );
    });

    return () => ctx.revert();
  }, []);

  return ref;
};

// Clip-path reveal — for images (wipe up from bottom)
export const useClipReveal = (options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: options.duration ?? 1.4,
          ease: options.ease ?? "power4.out",
          scrollTrigger: {
            trigger: el,
            start: options.start ?? "top 90%",
            once: true,
          },
        },
      );
    });

    return () => ctx.revert();
  }, []);

  return ref;
};
