import { useEffect } from "react";
import { FORM_URL } from "../content/affiliateCopy.js";

/**
 * Become a partner — iframe modal to the PRD form.
 */
export default function PartnerFormModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="af-modal" role="dialog" aria-modal="true" aria-label="Become a partner">
      <button type="button" className="af-modal-backdrop" aria-label="Close" onClick={onClose} />
      <div className="af-modal-panel">
        <header className="af-modal-bar">
          <strong>Become a partner</strong>
          <button type="button" className="af-modal-close" onClick={onClose} aria-label="Close form">
            ×
          </button>
        </header>
        <div className="af-modal-frame-clip">
          <iframe
            className="af-modal-frame"
            title="17TRACK Partnership Application"
            src={FORM_URL}
          />
        </div>
      </div>
    </div>
  );
}
