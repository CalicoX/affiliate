import { useEffect, useRef } from "react";
import PartnerApplicationForm from "./PartnerApplicationForm.jsx";

/**
 * Become a partner — local application form in the page modal.
 * The dimmed backdrop used to be a button closed on click. Native selects
 * dispatch that click onto whatever sits underneath when their menu closes,
 * so choosing an option dismissed the dialog. Close only on a pointer press
 * that actually starts on the backdrop.
 */
export default function PartnerFormModal({ open, onClose }) {
  const panelRef = useRef(null);

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

  function onBackdropPointerDown(event) {
    if (event.target !== event.currentTarget) return;
    const active = document.activeElement;
    if (active && panelRef.current?.contains(active) && active.tagName === "SELECT") return;
    onClose();
  }

  return (
    <div className="af-modal" role="dialog" aria-modal="true" aria-label="Become a partner">
      <div className="af-modal-backdrop" onPointerDown={onBackdropPointerDown} />
      <div className="af-modal-panel" ref={panelRef}>
        <header className="af-modal-bar">
          <strong>Become a partner</strong>
          <button type="button" className="af-modal-close" onClick={onClose} aria-label="Close form">
            ×
          </button>
        </header>
        <div className="af-modal-body">
          <PartnerApplicationForm />
        </div>
      </div>
    </div>
  );
}
