
/** Shared FX helpers — pure + small DOM utils */

export function prefersReducedMotion() {
  return !!(
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function isMobileLayout() {
  return !!(
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(max-width: 768px)").matches
  );
}

export function shouldReduceFx() {
  return prefersReducedMotion() || isMobileLayout() || !!window.__reduceFx;
}

/**
 * Observe element visibility; call onChange(boolean).
 * @returns {() => void} unobserve/disconnect
 */
export function observeVisibility(el, onChange, options = {}) {
  if (!el || typeof IntersectionObserver === "undefined") {
    onChange(true);
    return () => {};
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => onChange(e.isIntersecting));
    },
    { threshold: options.threshold ?? 0.05, rootMargin: options.rootMargin ?? "80px" }
  );
  io.observe(el);
  return () => io.disconnect();
}

/**
 * Run fn once when browser is idle (or after timeout fallback).
 */
export function whenIdle(fn, timeout = 1200) {
  if (typeof window === "undefined") return () => {};
  let cancelled = false;
  let id;
  const run = () => {
    if (!cancelled) fn();
  };
  if (typeof window.requestIdleCallback === "function") {
    id = window.requestIdleCallback(run, { timeout });
    return () => {
      cancelled = true;
      window.cancelIdleCallback?.(id);
    };
  }
  id = window.setTimeout(run, Math.min(timeout, 400));
  return () => {
    cancelled = true;
    clearTimeout(id);
  };
}

/** Parse impact metric attributes from a node */
export function parseImpactMetric(el) {
  if (!el) return null;
  const value = parseFloat(el.getAttribute("data-value") || "0");
  const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
  const plus = el.getAttribute("data-plus") === "1";
  return {
    value: Number.isFinite(value) ? value : 0,
    decimals: Number.isFinite(decimals) ? decimals : 0,
    plus,
  };
}

export function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}
