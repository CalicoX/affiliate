import { PARTNER_TYPES } from "../../content/affiliateCopy.js";
import BecomePartnerButton from "../BecomePartnerButton.jsx";

function PartnerIcon({ id }) {
  if (id === "agency") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 16.5 8.8 11.2l3.1 2.6L19.5 6.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.2 6.5H19.5V11.8"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (id === "logistics") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
        <path d="M4.2 12h15.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path
          d="M12 4c2.1 2.3 3.2 5 3.2 8s-1.1 5.7-3.2 8c-2.1-2.3-3.2-5-3.2-8s1.1-5.7 3.2-8Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3.8 8.2 12 4.5l8.2 3.7v7.6L12 19.5l-8.2-3.7V8.2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M12 12.1 20.2 8.3M12 12.1 3.8 8.3M12 12.1V19.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SuitablePartners() {
  return (
    <section
      className="section af-partners"
      id="who-we-partner"
      aria-labelledby="who-we-partner-heading"
    >
      <div className="section-inner af-partners-layout">
        <div className="af-partners-intro">
          <p className="af-eyebrow">{PARTNER_TYPES.eyebrow}</p>
          <h2 id="who-we-partner-heading">{PARTNER_TYPES.title}</h2>
          <p className="lead">{PARTNER_TYPES.lead}</p>
          <BecomePartnerButton />
        </div>

        <div className="af-partners-list">
          {PARTNER_TYPES.items.map((item) => (
            <article className="af-partner-item" key={item.id}>
              <span className="af-partner-icon">
                <PartnerIcon id={item.id} />
              </span>
              <h3>{item.headline}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
