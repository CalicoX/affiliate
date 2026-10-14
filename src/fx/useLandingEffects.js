import { useEffect } from "react";
import { useLenis } from "./useLenis.js";
import { observeVisibility, prefersReducedMotion, shouldReduceFx, whenIdle } from "./utils.js";

/**
 * Trimmed FX stack for Affiliate (reuse returns core modules only).
 */
const FX_LOADERS = {
  responsive: () => import("./modules/responsive-fx.js"),
  borderBeam: () => import("./modules/border-beam.js"),
  topbarTheme: () => import("./modules/topbar-theme.js"),
  landingInline: () => import("./modules/landing-inline.js"),
  bottomCta: () => import("./modules/bottom-cta-shader.js"),
  coverageGlobe: () => import("./modules/coverage-globe.js"),
};

export function useLandingEffects() {
  useLenis();

  useEffect(() => {
    const disposers = [];
    let cancelled = false;

    async function mountNamed(key) {
      if (cancelled || !FX_LOADERS[key]) return;
      try {
        const mod = await FX_LOADERS[key]();
        if (cancelled || !mod?.mount) return;
        const d = mod.mount();
        if (typeof d === "function") disposers.push(d);
      } catch (err) {
        console.warn(`[useLandingEffects] ${key}`, err);
      }
    }

    (async () => {
      await mountNamed("responsive");
      await mountNamed("borderBeam");
      await mountNamed("topbarTheme");
    })();

    whenIdle(() => {
      if (cancelled) return;
      mountNamed("landingInline");
      if (!prefersReducedMotion() && !shouldReduceFx()) {
        mountNamed("bottomCta");
      }
    });

    const coverage = document.getElementById("data-foundation");
    if (coverage && !prefersReducedMotion()) {
      let loaded = false;
      disposers.push(
        observeVisibility(coverage, (vis) => {
          if (!vis || loaded || cancelled) return;
          loaded = true;
          const stop = whenIdle(() => {
            if (!cancelled) mountNamed("coverageGlobe");
          }, 300);
          disposers.push(stop);
        }),
      );
    }

    return () => {
      cancelled = true;
      disposers.splice(0).forEach((d) => {
        try {
          d();
        } catch {
          /* ignore */
        }
      });
    };
  }, []);
}
