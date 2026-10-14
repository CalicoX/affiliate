/**
 * Above-the-fold product dock FX.
 * Loads liquid-glass-dock factory then creates the live dock instance.
 * @returns {Promise<() => void>} dispose
 */
export async function mountProductDock() {
  const { mount: mountLib } = await import("./modules/liquid-glass-dock.js");
  const disposeLib = mountLib();

  const tabs = document.getElementById("product-tabs");
  const source = document.getElementById("glass-source");
  const content = document.getElementById("glass-content");
  const output = document.getElementById("glass-output");

  if (!window.createLiquidGlassDock) {
    document.documentElement.classList.add("glass-mode-frosted");
    return () => {
      if (typeof disposeLib === "function") disposeLib();
    };
  }

  document.documentElement.classList.remove("glass-html-in-canvas");
  if (output) output.style.display = "";
  if (source && content && content.parentNode === source) {
    const shell0 = document.querySelector(".glass-shell");
    if (shell0) shell0.insertBefore(content, source);
  }

  let glass = null;
  try {
    glass = window.createLiquidGlassDock({
      source,
      content,
      output,
      tabsEl: tabs,
    });
    if (!glass) throw new Error("createLiquidGlassDock returned null");
    if (typeof glass.setMode === "function") glass.setMode("frosted");
    document.documentElement.classList.add("glass-mode-frosted");
  } catch (err) {
    console.warn("[mountProductDock]", err);
    document.documentElement.classList.add("glass-mode-frosted");
    glass = { onScroll() {}, destroy() {} };
  }

  const onScroll = () => {
    if (glass && glass.onScroll) glass.onScroll();
    if (typeof window.__updateAiScroll === "function") window.__updateAiScroll();
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  // Also hook Lenis if present later
  let lenisOff = null;
  const tryHookLenis = () => {
    if (window.__lenis && typeof window.__lenis.on === "function" && !lenisOff) {
      window.__lenis.on("scroll", onScroll);
      lenisOff = () => {
        try {
          window.__lenis?.off?.("scroll", onScroll);
        } catch {
          /* ignore */
        }
      };
    }
  };
  tryHookLenis();
  const hookTimer = window.setInterval(tryHookLenis, 200);
  window.setTimeout(() => clearInterval(hookTimer), 3000);

  return function dispose() {
    clearInterval(hookTimer);
    window.removeEventListener("scroll", onScroll);
    if (lenisOff) lenisOff();
    if (glass && typeof glass.destroy === "function") {
      try {
        glass.destroy();
      } catch {
        /* ignore */
      }
    }
    if (typeof disposeLib === "function") disposeLib();
  };
}
