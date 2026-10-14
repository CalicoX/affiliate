import { useEffect, useRef, useState } from "react";
import { PARTNER_TYPES } from "../../content/affiliateCopy.js";
import BecomePartnerButton from "../BecomePartnerButton.jsx";
import { PartnerVisual } from "./RouteScenes.jsx";

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

export default function SuitablePartners() {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const count = PARTNER_TYPES.items.length;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let lock = false;
    let cooldown = 0;
    let safety = 0;
    const measure = () => {
      const rect = track.getBoundingClientRect();
      const total = track.offsetHeight - window.innerHeight;
      const scrolled = clamp(-rect.top, 0, Math.max(total, 1));
      const p = total > 0 ? scrolled / total : 0;
      setIndex(p * (count - 1));
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        measure();
      });
    };

    const scrollNow = () =>
      typeof window.__lenis?.scroll === "number" ? window.__lenis.scroll : window.scrollY;

    const progressIndex = () => {
      const rect = track.getBoundingClientRect();
      const total = Math.max(track.offsetHeight - window.innerHeight, 1);
      return (clamp(-rect.top, 0, total) / total) * (count - 1);
    };

    const snapTop = (i) => {
      const rect = track.getBoundingClientRect();
      const total = Math.max(track.offsetHeight - window.innerHeight, 1);
      const p = count <= 1 ? 0 : i / (count - 1);
      return rect.top + scrollNow() + total * p;
    };

    const go = (dest) => {
      lock = true;
      window.clearTimeout(safety);
      const target = snapTop(dest);
      const release = () => {
        if (!lock) return;
        lock = false;
        cooldown = performance.now() + 420;
        measure();
      };
      const lenis = window.__lenis;
      if (lenis && typeof lenis.scrollTo === "function") {
        lenis.scrollTo(target, {
          duration: reduced ? 0 : 0.8,
          easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
          lock: true,
          force: true,
          onComplete: release,
        });
        safety = window.setTimeout(release, reduced ? 0 : 1200);
      } else {
        window.scrollTo({ top: target, behavior: reduced ? "auto" : "smooth" });
        safety = window.setTimeout(release, reduced ? 0 : 900);
      }
    };

    const step = (dir) => {
      if (lock || performance.now() < cooldown) return;
      const idx = progressIndex();
      const atStart = idx < 0.04 && dir < 0;
      const atEnd = idx > count - 1 - 0.04 && dir > 0;
      if (atStart || atEnd) return;
      const settled = Math.abs(idx - Math.round(idx)) < 0.08;
      const base = settled ? Math.round(idx) : idx;
      const dest =
        dir > 0
          ? Math.min(count - 1, Math.floor(base + 0.001) + 1)
          : Math.max(0, Math.ceil(base - 0.001) - 1);
      go(dest);
    };

    const engaged = () => {
      const rect = track.getBoundingClientRect();
      return rect.top <= 8 && rect.bottom >= window.innerHeight - 8;
    };

    const onWheel = (event) => {
      if (reduced || event.ctrlKey || !engaged()) return;
      const dir = event.deltaY > 0 ? 1 : event.deltaY < 0 ? -1 : 0;
      if (!dir) return;
      const idx = progressIndex();
      const atStart = idx < 0.04 && dir < 0;
      const atEnd = idx > count - 1 - 0.04 && dir > 0;
      if (atStart || atEnd) return;
      event.preventDefault();
      event.stopPropagation();
      step(dir);
    };

    let touchY = null;
    const onTouchStart = (event) => {
      touchY = event.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (event) => {
      if (reduced || touchY == null || !engaged()) return;
      const y = event.touches[0]?.clientY;
      if (y == null) return;
      const dy = touchY - y;
      if (Math.abs(dy) < 10) return;
      const dir = dy > 0 ? 1 : -1;
      const idx = progressIndex();
      const atStart = idx < 0.04 && dir < 0;
      const atEnd = idx > count - 1 - 0.04 && dir > 0;
      if (atStart || atEnd) return;
      event.preventDefault();
    };
    const onTouchEnd = (event) => {
      if (touchY == null || reduced) return;
      const endY = event.changedTouches[0]?.clientY ?? touchY;
      const dy = touchY - endY;
      touchY = null;
      if (Math.abs(dy) < 42 || !engaged()) return;
      step(dy > 0 ? 1 : -1);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(safety);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [count]);

  return (
    <>
      <div className="section-head center af-partners-intro" id="who-we-partner">
        <p className="af-eyebrow">{PARTNER_TYPES.eyebrow}</p>
        <h2 id="who-we-partner-heading">{PARTNER_TYPES.title}</h2>
        <p className="lead">{PARTNER_TYPES.lead}</p>
      </div>

      <section className="af-partners-scroll" ref={trackRef} aria-labelledby="who-we-partner-heading">
      <div className="af-partners-sticky">
        <div className="af-partners-stage">
          <div className="af-partners-visual">
            {PARTNER_TYPES.items.map((item, i) => {
              const delta = index - i;
              const fade = clamp(1 - Math.abs(delta), 0, 1);
              const drift = clamp(delta, -1, 1) * -14;
              const arrive = clamp(1 - Math.abs(delta) * 1.15, 0, 1);
              const open = (arrive * arrive * (3 - 2 * arrive)).toFixed(3);
              return (
                <div className="af-slide" key={item.id}>
                  <PartnerVisual
                    id={item.id}
                    photoStyle={{
                      opacity: fade,
                      transform: `translate3d(0, ${drift}%, 0) scale(1.28)`,
                    }}
                    glassStyle={{
                      "--ui-y": `${delta * -100}%`,
                      "--ui-x": "0px",
                      "--card-o": Number(open) === 0 ? "0" : "1",
                      "--card-open": open,
                    }}
                  />
                </div>
              );
            })}
          </div>

          <div className="af-partners-texts">
            {PARTNER_TYPES.items.map((item, i) => {
              const delta = index - i;
              const nearest = Math.abs(delta) < 0.5;
              return (
                <div
                  className={nearest ? "af-partner-copy is-current" : "af-partner-copy"}
                  key={item.id}
                  aria-hidden={!nearest}
                  style={{
                    transform: `translate3d(0, ${delta * -100}%, 0)`,
                    pointerEvents: nearest ? "auto" : "none",
                  }}
                >
                  <h3>{item.headline}</h3>
                  <p>{item.body}</p>
                  <BecomePartnerButton label={item.cta} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      </section>
    </>
  );
}
