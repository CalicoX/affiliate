/**
 * Topbar theme — ported from tracking ai-lab.js topbarOnDark + height measure.
 * Always-on (not tied to AI Lab). Toggles `.topbar-on-dark` when content under
 * the nav is a dark band (ROI / FAQ / bottom CTA / footer, etc.).
 * @returns {() => void}
 */
export function mount() {
  const disposers = [];

  // —— Measure topbar height → --topbar-h ——
  (function measure() {
    const bar = document.querySelector(".topbar");
    if (!bar) return;
    function run() {
      const h = Math.round(bar.getBoundingClientRect().height);
      if (h > 0) {
        document.documentElement.style.setProperty("--topbar-h", h + "px");
      }
    }
    run();
    window.addEventListener("resize", run, { passive: true });
    window.addEventListener("load", run);
    disposers.push(() => {
      window.removeEventListener("resize", run);
      window.removeEventListener("load", run);
    });
  })();

  // —— Dark under nav → denser topbar ——
  (function topbarOnDark() {
    const bar = document.querySelector(".topbar");
    if (!bar) return;

    /** Known dark section selectors (tracking + returns) */
    const DARK_SEL =
      "#ai-lab-intro, #bottom-cta, #returns-roi, " +
      ".ai-lab-intro, .ai-intro-bg, .bottom-cta, .site-footer, " +
      ".rt-roi";

    function isDarkUnderNav() {
      const br = bar.getBoundingClientRect();
      const x = Math.min(window.innerWidth - 2, Math.max(1, window.innerWidth * 0.5));
      const y = Math.min(window.innerHeight - 2, Math.max(1, br.bottom + 2));
      const prev = bar.style.visibility;
      bar.style.visibility = "hidden";
      const el = document.elementFromPoint(x, y);
      bar.style.visibility = prev || "";

      let node = el;
      let hops = 0;
      while (node && node !== document.documentElement && hops < 14) {
        if (node.nodeType === 1) {
          if (
            node.id === "ai-lab-intro" ||
            node.id === "bottom-cta" ||
            node.id === "returns-roi" ||
            (node.classList &&
              (node.classList.contains("ai-lab-intro") ||
                node.classList.contains("ai-intro-bg") ||
                node.classList.contains("bottom-cta") ||
                node.classList.contains("site-footer") ||
                node.classList.contains("rt-roi") ||
                (node.classList.contains("case-art") &&
                  node.classList.contains("dark"))))
          ) {
            return true;
          }
          if (node.closest && node.closest(DARK_SEL)) {
            return true;
          }
          const cs = window.getComputedStyle(node);
          const bg = cs.backgroundColor || "";
          const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
          if (m) {
            const R = +m[1];
            const G = +m[2];
            const B = +m[3];
            let a = 1;
            const am = bg.match(/,\s*([0-9.]+)\s*\)/);
            if (am) a = parseFloat(am[1]);
            if (a > 0.2) {
              const L = (0.2126 * R + 0.7152 * G + 0.0722 * B) / 255;
              return L < 0.42;
            }
          }
        }
        node = node.parentElement;
        hops++;
      }
      return false;
    }

    let topbarRaf = 0;
    function update() {
      if (topbarRaf) return;
      topbarRaf = requestAnimationFrame(() => {
        topbarRaf = 0;
        bar.classList.toggle("topbar-on-dark", isDarkUnderNav());
      });
    }

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    const prevTopbarScroll = window.__updateAiScroll;
    window.__updateAiScroll = function () {
      if (typeof prevTopbarScroll === "function") prevTopbarScroll();
      update();
    };
    if (window.__lenis && typeof window.__lenis.on === "function") {
      try {
        window.__lenis.on("scroll", update);
      } catch {
        /* ignore */
      }
    }
    setTimeout(() => {
      if (window.__lenis && typeof window.__lenis.on === "function") {
        try {
          window.__lenis.on("scroll", update);
        } catch {
          /* ignore */
        }
      }
      update();
    }, 0);
    requestAnimationFrame(update);

    disposers.push(() => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      if (topbarRaf) cancelAnimationFrame(topbarRaf);
      window.__updateAiScroll =
        typeof prevTopbarScroll === "function" ? prevTopbarScroll : undefined;
      bar.classList.remove("topbar-on-dark");
    });
  })();

  return function dispose() {
    while (disposers.length) {
      const fn = disposers.pop();
      try {
        if (typeof fn === "function") fn();
      } catch {
        /* ignore */
      }
    }
  };
}
