// utils/lenis.js
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenisInstance = null;

export function initLenis() {
  if (lenisInstance) return lenisInstance;

  const lenis = new Lenis({
    duration: 4,                    // Refined cinematic feel (recommended range: 1.4 - 1.8)
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Elegant smooth easing
    smoothWheel: true,
    smoothTouch: false,                // Keep native touch feel on mobile
    wheelMultiplier: 1,
    touchMultiplier: 1.8,
    infinite: false,
    lerp: 0.08,                        // Controls responsiveness vs smoothness
  });

  lenisInstance = lenis;

  // Sync Lenis scroll with GSAP ScrollTrigger
  lenis.on("scroll", ScrollTrigger.update);

  // Use GSAP ticker for smooth RAF loop
  const raf = (time) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  // Refresh ScrollTrigger on window resize
  const handleResize = () => ScrollTrigger.refresh();
  window.addEventListener("resize", handleResize);

  // Optional: Log for debugging
  // lenis.on('scroll', ({ scroll, limit, velocity }) => {
  //   console.log('Lenis scroll:', scroll);
  // });

  return lenis;
}

export function getLenis() {
  return lenisInstance;
}

export function destroyLenis() {
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
}

// Helper to stop/start Lenis (useful for modals, menus, etc.)
export function stopLenis() {
  if (lenisInstance) lenisInstance.stop();
}

export function startLenis() {
  if (lenisInstance) lenisInstance.start();
}