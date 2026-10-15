import { HERO } from "../../content/affiliateCopy.js";
import BecomePartnerButton from "../BecomePartnerButton.jsx";

/** Affiliate hero — copy on the left, partner photo fading in on the right. */
export default function Hero() {
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
      </div>
      <div className="af-hero-visual" aria-hidden="true">
        <img className="af-hero-photo" src="/assets/hero/partner-hero.jpg" alt="" />
      </div>
    </section>
  );
}
