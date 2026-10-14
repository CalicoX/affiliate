import { usePartnerForm } from "./PartnerFormContext.jsx";

/** Shared CTA that opens the partner application modal */
export default function BecomePartnerButton({
  className = "btn-switch",
  label = "Become a partner",
  onDark = false,
}) {
  const { openForm } = usePartnerForm();
  const isSwitch = className.split(/\s+/).includes("btn-switch");
  const cls = onDark ? `${className} on-dark` : className;

  return (
    <button type="button" className={cls} onClick={openForm}>
      {isSwitch ? (
        <>
          <span className="btn-switch-knob" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="5" cy="12" r="1.4" fill="currentColor" opacity="0.35" />
              <circle cx="8.2" cy="12" r="1.5" fill="currentColor" opacity="0.55" />
              <circle cx="11.5" cy="12" r="1.6" fill="currentColor" opacity="0.8" />
              <path
                d="M13 7.5L18.5 12 13 16.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="btn-switch-label">{label}</span>
        </>
      ) : (
        label
      )}
    </button>
  );
}
