import { BOTTOM_CTA } from "../../content/affiliateCopy.js";
import BecomePartnerButton from "../BecomePartnerButton.jsx";

export default function BottomCta() {
  return (
    <section className="bottom-cta rt-bottom-cta" id="bottom-cta">
      <canvas className="bottom-cta-shader" id="bottom-cta-shader" aria-hidden="true" />
      <div className="section-inner">
        <div>
          <h2>{BOTTOM_CTA.title}</h2>
          <p>{BOTTOM_CTA.lead}</p>
        </div>
        <div className="cta-row">
          <BecomePartnerButton onDark label={BOTTOM_CTA.cta} />
        </div>
      </div>
    </section>
  );
}
