import { useEffect } from "react";
import Lenis from "lenis";
import { prefersReducedMotion } from "./utils.js";

/**
 * Smooth scroll owned by React — exposes window.__lenis for legacy consumers.
 */
export function useLenis() {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
      prevent: (node) =>
        !!(
          node &&
          node.closest &&
          node.closest(
            "[data-lenis-prevent], .ogl-page, .ai-case-lightbox-scroll, .ai-case-lightbox"
          )
        ),
    });

    window.__lenis = lenis;

    let raf = 0;
    const frame = (time) => {
      if (document.hidden) {
        raf = 0;
        return;
      }
      lenis.raf(time);
      raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf && !document.hidden) raf = requestAnimationFrame(frame);
    };
    kick();

    const onVisibility = () => {
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        return;
      }
      kick();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onScroll = () => {
      if (typeof window.__updateAiScroll === "function") {
        window.__updateAiScroll();
      }
    };
    lenis.on("scroll", onScroll);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(raf);
      try {
        lenis.off("scroll", onScroll);
      } catch {
        /* older lenis */
      }
      lenis.destroy();
      if (window.__lenis === lenis) delete window.__lenis;
    };
  }, []);
}
