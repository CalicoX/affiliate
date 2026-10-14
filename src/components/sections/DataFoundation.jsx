import { useEffect, useRef, useState } from "react";
import { DATA_FOUNDATION } from "../../content/affiliateCopy.js";

const COUNT_MS = 1000;
const STAGGER_MS = 80;
const BLUR_START = 6;

function parseMetric(value) {
  const final = String(value);
  const match = final.match(/^(\D*?)([\d,]+)(.*)$/);
  if (!match) {
    return { target: 0, prefix: "", suffix: "", commas: false, final };
  }
  const [, prefix, digits, suffix] = match;
  return {
    target: Number(digits.replace(/,/g, "")),
    prefix,
    suffix,
    commas: digits.includes(","),
    final,
  };
}

const METRICS = DATA_FOUNDATION.metrics.map((item) => ({
  label: item.label,
  spec: parseMetric(item.value),
}));

function groupDigits(n) {
  return String(Math.max(0, Math.round(n))).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatCount(amount, spec) {
  const body = spec.commas ? groupDigits(amount) : String(Math.max(0, Math.round(amount)));
  return `${spec.prefix}${body}${spec.suffix}`;
}

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function settledFrame() {
  return {
    texts: METRICS.map((item) => item.spec.final),
    blurs: METRICS.map(() => 0),
  };
}

function useCoverageCount() {
  const rootRef = useRef(null);
  const [frame, setFrame] = useState(() => {
    if (typeof window !== "undefined" && prefersReducedMotion()) return settledFrame();
    return {
      texts: METRICS.map((item) => formatCount(0, item.spec)),
      blurs: METRICS.map(() => 0),
    };
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    if (prefersReducedMotion()) {
      setFrame(settledFrame());
      return undefined;
    }

    let raf = 0;
    let started = false;

    const tick = (now, origin) => {
      let pending = false;
      const texts = [];
      const blurs = [];

      METRICS.forEach((item, i) => {
        const elapsed = now - origin - i * STAGGER_MS;
        if (elapsed >= COUNT_MS) {
          texts.push(item.spec.final);
          blurs.push(0);
          return;
        }
        pending = true;
        if (elapsed <= 0) {
          texts.push(formatCount(0, item.spec));
          blurs.push(BLUR_START);
          return;
        }
        const eased = easeOutCubic(elapsed / COUNT_MS);
        texts.push(formatCount(item.spec.target * eased, item.spec));
        blurs.push((1 - eased) * BLUR_START);
      });

      setFrame({ texts, blurs });
      if (pending) raf = requestAnimationFrame((t) => tick(t, origin));
    };

    const start = () => {
      if (started) return;
      started = true;
      const origin = performance.now();
      raf = requestAnimationFrame((t) => tick(t, origin));
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          start();
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(root);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return { rootRef, texts: frame.texts, blurs: frame.blurs };
}

function CoverageStats() {
  const { rootRef, texts, blurs } = useCoverageCount();

  return (
    <ul className="coverage-data af-coverage-data" ref={rootRef}>
      {METRICS.map((item, i) => {
        const blur = blurs[i] ?? 0;
        return (
          <li key={item.label} style={{ ["--cv-i"]: String(i) }}>
            <strong
              aria-label={item.spec.final}
              style={blur > 0.05 ? { filter: `blur(${blur.toFixed(2)}px)` } : undefined}
            >
              {texts[i]}
            </strong>
            <span>{item.label}</span>
          </li>
        );
      })}
    </ul>
  );
}

/** Same stats band as Tracking / API coverage, with Affiliate PRD labels. */
export default function DataFoundation() {
  return (
    <section className="coverage-band af-data is-in" id="data-foundation">
      <canvas className="coverage-globe" id="coverage-globe-canvas" aria-hidden="true" />
      <div className="section-inner">
        <div className="section-head coverage-head center">
          <p className="af-eyebrow">{DATA_FOUNDATION.eyebrow}</p>
          <h2>{DATA_FOUNDATION.title}</h2>
          <p className="lead">{DATA_FOUNDATION.lead}</p>
        </div>

        <CoverageStats />

        <p className="af-trust-line">{DATA_FOUNDATION.trustLine}</p>
        <p className="af-data-footer">{DATA_FOUNDATION.footer}</p>
      </div>
    </section>
  );
}
