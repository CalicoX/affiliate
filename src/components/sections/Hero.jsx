import { useLayoutEffect, useRef, useState } from "react";
import { HERO } from "../../content/affiliateCopy.js";
import BecomePartnerButton from "../BecomePartnerButton.jsx";

const ORBIT_CARDS = [
  { id: "logistics", name: "Logistics", logos: ["dhl", "fedex", "ups"], ring: "outer", angle: 0 },
  { id: "owen", name: "Owen", role: "3PL", photo: "/assets/people/owen.jpg", focus: "center 12%", ring: "inner", angle: 45 },
  { id: "maya", name: "Maya", role: "Tech", photo: "/assets/people/maya.jpg", ring: "outer", angle: 90 },
  { id: "elena", name: "Elena", role: "Shopify", photo: "/assets/people/elena.jpg", focus: "center 24%", ring: "inner", angle: 135 },
  { id: "luis", name: "Luis", role: "Agency", photo: "/assets/people/luis.jpg", ring: "outer", angle: 180 },
  { id: "nora", name: "Nora", role: "Marketplace", photo: "/assets/people/nora.jpg", focus: "center center", ring: "inner", angle: 225 },
  { id: "marco", name: "Marco", role: "Returns", photo: "/assets/people/marco.jpg", focus: "center 18%", ring: "outer", angle: 270 },
  {
    id: "dtc",
    name: "DTC",
    logos: ["/assets/logos/baleaf.png", "/assets/logos/anker.svg", "/assets/logos/plaud.png"],
    ring: "inner",
    angle: 315,
  },
];

/** Affiliate Hero KV — copy + partner network visual */
/** Clockwise from the top (270deg in this sin/cos layout). */
function enterOrder(angle) {
  return ((angle - 270 + 360) % 360) / 45;
}

export default function Hero() {
  const orbitRef = useRef(null);
  const [halves, setHalves] = useState({});
  const [entered, setEntered] = useState(false);

  useLayoutEffect(() => {
    setEntered(true);
    const root = orbitRef.current;
    if (!root) return;
    const nodes = [...root.querySelectorAll("[data-orbit-card]")];
    const measure = () => {
      const next = {};
      nodes.forEach((node) => {
        next[node.dataset.orbitCard] = node.offsetWidth / 2;
      });
      setHalves((prev) => {
        const ids = Object.keys(next);
        const same = ids.length === Object.keys(prev).length && ids.every((id) => Math.abs(prev[id] - next[id]) < 0.5);
        return same ? prev : next;
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="rt-hero hero af-hero" id="affiliate-hero">
      <div className="rt-wrap rt-hero-inner hero-inner">
        <div className="rt-hero-copy">
          <h1>
            <span className="rt-hero-line">{HERO.title}</span>
          </h1>
          <p className="lead rt-hero-lead">{HERO.lead}</p>
          <div className="cta-row rt-hero-cta">
            <BecomePartnerButton label={HERO.primaryCta} />
            <a className="btn-demo" href={HERO.secondaryHref}>
              {HERO.secondaryCta}
            </a>
          </div>
        </div>

        <div className="af-hero-visual" aria-hidden="true">
          <div className="af-hero-stage">
          <div className={`af-hero-orbit${entered ? " is-in" : ""}`} ref={orbitRef}>
            <span className="af-hero-ring" />
            <span className="af-hero-ring af-hero-ring--2" />
            <svg className="af-hero-logo-defs" width="0" height="0" aria-hidden="true">
              <clipPath id="af-hero-logo-squircle" clipPathUnits="objectBoundingBox">
                <path d="M0.6456,0.0034Q0.7912,0.0069 0.8351,0.0174Q0.8789,0.0280 0.9071,0.0463Q0.9353,0.0647 0.9537,0.0929Q0.9720,0.1211 0.9826,0.1649Q0.9931,0.2088 0.9966,0.3544Q1.0000,0.5000 0.9966,0.6456Q0.9931,0.7912 0.9826,0.8351Q0.9720,0.8789 0.9537,0.9071Q0.9353,0.9353 0.9071,0.9537Q0.8789,0.9720 0.8351,0.9826Q0.7912,0.9931 0.6456,0.9966Q0.5000,1.0000 0.3544,0.9966Q0.2088,0.9931 0.1649,0.9826Q0.1211,0.9720 0.0929,0.9537Q0.0647,0.9353 0.0463,0.9071Q0.0280,0.8789 0.0174,0.8351Q0.0069,0.7912 0.0034,0.6456Q0.0000,0.5000 0.0034,0.3544Q0.0069,0.2088 0.0174,0.1649Q0.0280,0.1211 0.0463,0.0929Q0.0647,0.0647 0.0929,0.0463Q0.1211,0.0280 0.1649,0.0174Q0.2088,0.0069 0.3544,0.0034Q0.5000,0.0000 0.6456,0.0034Z" />
              </clipPath>
            </svg>
            <span className="af-hero-node af-hero-node--core">
              <img className="af-hero-mark" src="/assets/brand/logo-17-mark.png" alt="" />
            </span>
            {ORBIT_CARDS.map((card) => (
                <span
                  className={`af-hero-node af-hero-node--${card.ring}`}
                  key={card.id}
                  data-orbit-card={card.id}
                  style={{
                    "--start": `${card.angle}deg`,
                    "--enter": enterOrder(card.angle),
                    "--half": halves[card.id] ? `${halves[card.id]}px` : undefined,
                  }}
                >
                  <span className="af-hero-person">
                    {card.logos ? (
                      <span className="af-hero-logos">
                        {card.logos.map((logo) => (
                          <img
                            key={logo}
                            className={card.id === "dtc" ? "af-hero-logo-brand" : undefined}
                            src={logo.includes("/") ? logo : `/assets/carriers/${logo}.svg`}
                            alt=""
                          />
                        ))}
                      </span>
                    ) : (
                      <img
                        src={card.photo}
                        alt=""
                        style={card.focus ? { objectPosition: card.focus } : undefined}
                      />
                    )}
                    <span>
                      <strong>{card.name}</strong>
                      {card.role ? <em>{card.role}</em> : null}
                    </span>
                  </span>
                </span>
              ))}
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
