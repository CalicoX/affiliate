import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DIRECTORY, DIRECTORY_CATEGORIES } from "../../content/affiliateCopy.js";
import BecomePartnerButton from "../BecomePartnerButton.jsx";

function FilterChevron({ direction }) {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path
        d={direction === "left" ? "M10 3.5 5.5 8 10 12.5" : "M6 3.5 10.5 8 6 12.5"}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PartnerDirectory() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const scrollerRef = useRef(null);
  const [scrollEdges, setScrollEdges] = useState({ left: false, right: false });

  const updateEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setScrollEdges({
      left: el.scrollLeft > 2,
      right: max - el.scrollLeft > 2,
    });
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return undefined;
    updateEdges();
    const observer = new ResizeObserver(updateEdges);
    observer.observe(el);
    el.addEventListener("scroll", updateEdges, { passive: true });
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", updateEdges);
    };
  }, [updateEdges]);

  function scrollFilters(direction) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * Math.max(180, el.clientWidth * 0.6), behavior: "smooth" });
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DIRECTORY.partners.filter((p) => {
      const tags = [p.category, ...(p.filters || [])].filter(Boolean);
      const catOk = category === "All" || tags.includes(category);
      if (!catOk) return false;
      if (!q) return true;
      return [p.name, p.category, p.region, p.blurb].some((field) =>
        field?.toLowerCase().includes(q),
      );
    });
  }, [query, category]);

  return (
    <section className="section af-directory" id="partner-directory">
      <div className="section-inner">
        <div className="section-head center">
          <p className="af-eyebrow">{DIRECTORY.eyebrow}</p>
          <h2>{DIRECTORY.title}</h2>
          <p className="lead">{DIRECTORY.lead}</p>
        </div>

        <div className="af-directory-tools">
          <label className="af-search">
            <span className="sr-only">Search partners</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={DIRECTORY.searchPlaceholder}
            />
          </label>

          <div className="af-filter-row">
            <button
              type="button"
              className="af-filter-nav"
              aria-label="Scroll categories left"
              disabled={!scrollEdges.left}
              onClick={() => scrollFilters(-1)}
            >
              <FilterChevron direction="left" />
            </button>
            <div
              className="af-filters"
              ref={scrollerRef}
              role="listbox"
              aria-label="Category filter"
            >
              {DIRECTORY_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  role="option"
                  aria-selected={category === cat}
                  className={category === cat ? "is-active" : undefined}
                  onClick={(event) => {
                    setCategory(cat);
                    const scroller = scrollerRef.current;
                    const chip = event.currentTarget;
                    if (!scroller) return;
                    const chipLeft = chip.offsetLeft;
                    const chipRight = chipLeft + chip.offsetWidth;
                    const viewLeft = scroller.scrollLeft;
                    const viewRight = viewLeft + scroller.clientWidth;
                    if (chipLeft < viewLeft) {
                      scroller.scrollTo({ left: chipLeft - 8, behavior: "smooth" });
                    } else if (chipRight > viewRight) {
                      scroller.scrollTo({
                        left: chipRight - scroller.clientWidth + 8,
                        behavior: "smooth",
                      });
                    }
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="af-filter-nav"
              aria-label="Scroll categories right"
              disabled={!scrollEdges.right}
              onClick={() => scrollFilters(1)}
            >
              <FilterChevron direction="right" />
            </button>
          </div>
        </div>

        <div className="af-partner-grid">
          {filtered.map((p) => (
            <article className="af-partner-card" key={p.name}>
              <div className="af-partner-mark" aria-hidden="true">
                {p.logo ? <img src={p.logo} alt="" /> : p.initial}
              </div>
              <div className="af-partner-meta">
                <h3>{p.name}</h3>
                {p.category ? <p className="af-partner-cat">{p.category}</p> : null}
                {p.blurb ? <p>{p.blurb}</p> : null}
                {p.region ? <p className="af-partner-region">{p.region}</p> : null}
              </div>
            </article>
          ))}
          {filtered.length === 0 && (
            <p className="af-directory-empty">No partners match this search.</p>
          )}
        </div>

        <div className="af-section-cta">
          <BecomePartnerButton />
        </div>
      </div>
    </section>
  );
}
